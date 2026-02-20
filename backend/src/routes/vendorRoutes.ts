import express from "express";
import Booking from "../models/Booking";
import User, { UserRole } from "../models/User";
import Vendor from "../models/Vendor";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const vendors = await Vendor.find().sort({ name: 1 });
    res.json(vendors);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error fetching vendors" });
  }
});

router.post("/", async (req, res) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json(vendor);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error creating vendor" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json(vendor);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error updating vendor" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });
    res.json({ message: "Vendor deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error deleting vendor" });
  }
});

// Get dashboard stats for a vendor
router.get("/:vendorId/stats", async (req, res) => {
  try {
    const { vendorId } = req.params;

    const bookings = await Booking.find({ vendorId });
    const partners = await User.find({ vendorId, role: UserRole.PARTNER });

    const totalRevenue = bookings
      .filter((b) => b.status === "COMPLETED")
      .reduce((acc, b) => acc + (b.amount || 0), 0);

    const activePartners = partners.filter((p) => p.isVerified).length;

    res.json({
      totalRevenue,
      totalBookings: bookings.length,
      activePartners,
      recentBookings: bookings.slice(0, 5),
    });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error fetching vendor stats" });
  }
});

// Get bookings for a vendor
router.get("/:vendorId/bookings", async (req, res) => {
  try {
    const { vendorId } = req.params;
    const bookings = await Booking.find({ vendorId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error fetching vendor bookings" });
  }
});

// Get partners for a vendor
router.get("/:vendorId/partners", async (req, res) => {
  try {
    const { vendorId } = req.params;
    const partners = await User.find({ vendorId, role: UserRole.PARTNER });
    res.json(partners);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: error.message || "Error fetching vendor partners" });
  }
});

export default router;
