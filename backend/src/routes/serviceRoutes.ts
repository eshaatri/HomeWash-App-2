import express from "express";
import Service from "../models/Service";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const services = await Service.find();
    res.json(services);
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          error instanceof Error ? error.message : "Error fetching services",
      });
  }
});

router.post("/", async (req, res) => {
  try {
    const service = await Service.create(req.body);
    res.status(201).json(service);
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          error instanceof Error ? error.message : "Error creating service",
      });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json(service);
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          error instanceof Error ? error.message : "Error updating service",
      });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.json({ message: "Service deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message:
          error instanceof Error ? error.message : "Error deleting service",
      });
  }
});

export default router;
