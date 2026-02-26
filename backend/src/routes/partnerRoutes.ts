import express from "express";
import Booking from "../models/Booking";
import User, { UserRole } from "../models/User";
import Partner from "../models/Partner";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const partners = await Partner.find().sort({ name: 1 });
    res.json(partners);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error fetching partners" });
  }
});

router.post("/", async (req, res) => {
  try {
    const partner = await Partner.create(req.body);
    res.status(201).json(partner);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error creating partner" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const partner = await Partner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.json(partner);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error updating partner" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const partner = await Partner.findByIdAndDelete(req.params.id);
    if (!partner) return res.status(404).json({ message: "Partner not found" });
    res.json({ message: "Partner deleted successfully" });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error deleting partner" });
  }
});

// Get dashboard stats for a partner
router.get("/:partnerId/stats", async (req, res) => {
  try {
    const { partnerId } = req.params;

    const bookings = await Booking.find({ partnerId });
    const professionals = await User.find({
      partnerId,
      role: UserRole.PROFESSIONAL,
    });

    const totalRevenue = bookings
      .filter((b) => b.status === "COMPLETED")
      .reduce((acc, b) => acc + (b.amount || 0), 0);

    const activeProfessionals = professionals.filter(
      (p) => p.isVerified,
    ).length;

    res.json({
      totalRevenue,
      totalBookings: bookings.length,
      activeProfessionals,
      recentBookings: bookings.slice(0, 5),
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error fetching partner stats" });
  }
});

// Get bookings for a partner
router.get("/:partnerId/bookings", async (req, res) => {
  try {
    const { partnerId } = req.params;
    const bookings = await Booking.find({ partnerId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error fetching partner bookings" });
  }
});

// Get professionals for a partner
router.get("/:partnerId/professionals", async (req, res) => {
  try {
    const { partnerId } = req.params;
    const professionals = await User.find({
      partnerId,
      role: UserRole.PROFESSIONAL,
    });
    res.json(professionals);
  } catch (error: any) {
    res
      .status(500)
      .json({
        message: error.message || "Error fetching partner professionals",
      });
  }
});

export default router;
