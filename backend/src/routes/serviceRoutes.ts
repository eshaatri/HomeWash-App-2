import express from "express";
import Service from "../models/Service";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error fetching services",
    });
  }
});

// Update a service
router.patch("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error updating service",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error creating service",
    });
  }
});

export default router;
