import express from "express";
import Booking, { BookingStatus } from "../models/Booking";
import User from "../models/User";
import Lead from "../models/Lead";
import Partner from "../models/Partner";
import {
  createInitialLeadsForBooking,
  professionalServesArea,
} from "../services/bookingAssignmentService";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error fetching bookings",
    });
  }
});

router.get("/customer/:customerId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      customerId: req.params.customerId,
    }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Error fetching customer bookings",
    });
  }
});

router.get("/professional/:professionalId", async (req, res) => {
  try {
    const professional = await User.findById(req.params.professionalId);
    if (!professional)
      return res.status(404).json({ message: "Professional not found" });

    const isSuspended = professional.status === "SUSPENDED";

    if (isSuspended) {
      const bookings = await Booking.find({
        professionalId: req.params.professionalId,
      }).sort({ createdAt: -1 });
      return res.json(bookings);
    }

    // Fetch bookings that this professional either owns or has an OPEN/ACCEPTED lead for
    const leads = await Lead.find({
      professionalId: professional._id,
      status: { $in: ["OPEN", "ACCEPTED"] },
    })
      .select("bookingId status")
      .lean();

    const leadBookingIds = leads.map((l) => l.bookingId);

    const bookings = await Booking.find({
      $or: [
        { professionalId: req.params.professionalId },
        { _id: { $in: leadBookingIds } },
      ],
    }).sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Error fetching professional bookings",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    const serviceArea = booking.serviceArea;
    const io = req.app.get("io");

    // 1) Try in-house team first (auto-assign to an in-house professional who serves this area)
    if (serviceArea) {
      const inhouseProfessionals = await User.find({
        role: "PROFESSIONAL",
        isInhouse: true,
        status: { $ne: "SUSPENDED" },
      })
        .select("name image serviceArea serviceAreaIds")
        .lean();

      const inhouseInArea = inhouseProfessionals.filter((p) =>
        professionalServesArea(
          {
            serviceArea: (p as any).serviceArea,
            serviceAreaIds: (p as any).serviceAreaIds,
          },
          serviceArea,
        ),
      );

      if (inhouseInArea.length > 0) {
        const chosen = inhouseInArea[0];

        booking.professionalId = String((chosen as any)._id);
        booking.professionalName = (chosen as any).name;
        (booking as any).professionalImage = (chosen as any).image;
        booking.status = BookingStatus.CONFIRMED;
        await booking.save();

        return res.status(201).json(booking);
      }

      // 2) No in-house match: route to partners covering this area
      const partners = await Partner.find({
        isActive: true,
        activeAreas: serviceArea,
      })
        .select("_id")
        .lean();

      if (partners.length > 0) {
        booking.status = BookingStatus.NEW_FOR_PARTNERS;
        // attemptedPartnerIds starts empty; priority remains NORMAL
        booking.set("attemptedPartnerIds", []);
        await booking.save();

        // Notify partners that a new booking is available in their area
        if (io) {
          const bookingId = booking.id;
          partners.forEach((p: any) => {
            io.to(`partner:${String(p._id)}`).emit("partner:booking:new", {
              bookingId,
              status: booking.status,
              amount: booking.amount,
              serviceName: booking.serviceName,
            });
          });
        }

        return res.status(201).json(booking);
      }
    }

    // 3) Fallback: no in-house team or partners in area → send to central lead pool
    booking.set("priority", "HIGH");
    booking.set("escalationReason", "NO_INHOUSE_OR_PARTNER_IN_AREA");
    await booking.save();
    await createInitialLeadsForBooking(booking);

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error creating booking",
    });
  }
});

router.patch("/:id/status", async (req, res) => {
  const { status, professionalId } = req.body as {
    status: string;
    professionalId?: string;
  };
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Handle acceptance via professional app: first time someone confirms the job
    if (
      status === BookingStatus.CONFIRMED &&
      professionalId &&
      !booking.professionalId
    ) {
      const lead = await Lead.findOneAndUpdate(
        {
          bookingId: booking._id,
          professionalId,
          status: "OPEN",
        },
        { status: "ACCEPTED" },
        { new: true },
      );

      if (!lead) {
        return res
          .status(400)
          .json({ message: "No open lead found for this professional" });
      }

      await Lead.updateMany(
        {
          bookingId: booking._id,
          _id: { $ne: lead._id },
          status: "OPEN",
        },
        { status: "EXPIRED" },
      );

      const professional = await User.findById(professionalId).select(
        "name",
      );

      booking.professionalId = professionalId;
      booking.professionalName = professional?.name;
      booking.status = BookingStatus.PROFESSIONAL_ASSIGNED;
      await booking.save();

      return res.json(booking);
    }

    booking.status = status as BookingStatus;
    await booking.save();
    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error updating status",
    });
  }
});

// Partner view of bookings: new leads in their areas plus bookings they already own
router.get("/partner/:partnerId", async (req, res) => {
  try {
    const { partnerId } = req.params;

    const partner = await Partner.findById(partnerId).lean();
    if (!partner)
      return res.status(404).json({ message: "Partner not found" });

    const activeAreas: string[] = (partner as any).activeAreas || [];

    const orConditions: any[] = [
      // Bookings this partner already owns
      { partnerId },
    ];

    if (activeAreas.length > 0) {
      // New bookings visible to this partner (not yet accepted by any partner)
      orConditions.push({
        status: BookingStatus.NEW_FOR_PARTNERS,
        serviceArea: { $in: activeAreas },
        $or: [
          { attemptedPartnerIds: { $exists: false } },
          { attemptedPartnerIds: { $size: 0 } },
          { attemptedPartnerIds: { $ne: partnerId } },
        ],
      });
    }

    const bookings = await Booking.find({ $or: orConditions }).sort({
      createdAt: -1,
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Error fetching partner bookings",
    });
  }
});

// Partner accepts responsibility for a booking in their area
router.patch("/:id/partner-accept", async (req, res) => {
  const { partnerId } = req.body as { partnerId?: string };
  if (!partnerId) {
    return res
      .status(400)
      .json({ message: "partnerId is required to accept booking" });
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== BookingStatus.NEW_FOR_PARTNERS) {
      return res.status(400).json({
        message: "Only NEW_FOR_PARTNERS bookings can be accepted by a partner",
      });
    }

    const partner = await Partner.findById(partnerId).lean();
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    const activeAreas: string[] = (partner as any).activeAreas || [];
    if (!booking.serviceArea || !activeAreas.includes(booking.serviceArea)) {
      return res.status(403).json({
        message: "Partner does not cover this booking's service area",
      });
    }

    booking.partnerId = partnerId;
    booking.status = BookingStatus.PARTNER_ACCEPTED;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Error accepting booking for partner",
    });
  }
});

// Partner rejects a booking; may route to other partners or escalate to central pool
router.patch("/:id/partner-reject", async (req, res) => {
  const { partnerId } = req.body as { partnerId?: string };
  if (!partnerId) {
    return res
      .status(400)
      .json({ message: "partnerId is required to reject booking" });
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const io = req.app.get("io");

    const attempted = booking.attemptedPartnerIds || [];
    if (!attempted.includes(partnerId)) {
      attempted.push(partnerId);
      booking.set("attemptedPartnerIds", attempted);
    }

    const serviceArea = booking.serviceArea;

    if (serviceArea) {
      const remainingPartners = await Partner.find({
        isActive: true,
        activeAreas: serviceArea,
        _id: { $nin: attempted },
      })
        .select("_id")
        .lean();

      if (remainingPartners.length > 0) {
        // Stay in partner pool; other partners will see it in their feed
        booking.status = BookingStatus.NEW_FOR_PARTNERS;
        await booking.save();
        return res.json(booking);
      }
    }

    // No partners left → escalate to central lead pool
    booking.status = BookingStatus.PENDING;
    booking.set("priority", "HIGH");
    booking.set("escalationReason", "NO_PARTNER_ACCEPTED");
    await booking.save();
    await createInitialLeadsForBooking(booking);

    // High-priority alert for admins
    if (io) {
      io.to("admin").emit("admin:booking:escalated", {
        bookingId: booking.id,
        reason: "NO_PARTNER_ACCEPTED",
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Error rejecting booking for partner",
    });
  }
});

// Partner assigns a specific professional under them; this is final (no accept/reject in pro app)
router.patch("/:id/assign-professional", async (req, res) => {
  const { partnerId, professionalId } = req.body as {
    partnerId?: string;
    professionalId?: string;
  };

  if (!partnerId || !professionalId) {
    return res.status(400).json({
      message: "partnerId and professionalId are required to assign booking",
    });
  }

  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.partnerId !== partnerId) {
      return res.status(403).json({
        message: "Booking is not owned by this partner",
      });
    }

    if (booking.status !== BookingStatus.PARTNER_ACCEPTED) {
      return res.status(400).json({
        message: "Only PARTNER_ACCEPTED bookings can have a professional assigned",
      });
    }

    const professional = await User.findById(professionalId).lean();
    if (!professional) {
      return res.status(404).json({ message: "Professional not found" });
    }

    if ((professional as any).partnerId !== partnerId) {
      return res.status(403).json({
        message: "Professional does not belong to this partner",
      });
    }

    booking.professionalId = professionalId;
    booking.professionalName = (professional as any).name;
    (booking as any).professionalImage = (professional as any).image;
    // Partner assignment is final: treat as confirmed job for the professional
    booking.status = BookingStatus.CONFIRMED;
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Error assigning professional for booking",
    });
  }
});

router.patch("/:id/reject", async (req, res) => {
  const { professionalId } = req.body;
  try {
    const booking = await Booking.findById(req.params.id).lean();
    if (!booking)
      return res.status(404).json({ message: "Booking not found" });
    if (booking.professionalId !== professionalId)
      return res
        .status(403)
        .json({ message: "Booking is not assigned to this professional" });
    if (booking.status !== "PROFESSIONAL_ASSIGNED")
      return res
        .status(400)
        .json({ message: "Only assigned bookings can be rejected" });

    const unassigned = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        $unset: {
          professionalId: "",
          professionalName: "",
          professionalImage: "",
        },
        status: "PENDING",
      },
      { new: true },
    );
    if (!unassigned) return res.status(404).json({ message: "Booking not found" });

    res.json(unassigned);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error rejecting booking",
    });
  }
});

export default router;
