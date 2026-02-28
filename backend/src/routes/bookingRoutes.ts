import express from "express";
import Booking from "../models/Booking";
import User from "../models/User";
import { tryAssignBookingToClosestOnline } from "../services/bookingAssignmentService";

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

    const query = isSuspended
      ? { professionalId: req.params.professionalId }
      : {
          $or: [
            { professionalId: req.params.professionalId },
            {
              status: "PENDING",
              serviceArea: professional.serviceArea,
              professionalId: { $exists: false },
            },
          ],
        };

    const bookings = await Booking.find(query).sort({ createdAt: -1 });
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
    const assigned = await tryAssignBookingToClosestOnline(booking);
    const result = assigned ?? booking;
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error creating booking",
    });
  }
});

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );
    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error updating status",
    });
  }
});

export default router;
