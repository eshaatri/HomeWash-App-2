import express from "express";
import Booking from "../models/Booking";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({
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
    res
      .status(500)
      .json({
        message:
          error instanceof Error
            ? error.message
            : "Error fetching customer bookings",
      });
  }
});

router.get("/partner/:partnerId", async (req, res) => {
  try {
    const bookings = await Booking.find({
      partnerId: req.params.partnerId,
    }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          error instanceof Error
            ? error.message
            : "Error fetching partner bookings",
      });
  }
});

router.post("/", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (error) {
    res
      .status(500)
      .json({
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
    res
      .status(500)
      .json({
        message:
          error instanceof Error ? error.message : "Error updating status",
      });
  }
});

export default router;
