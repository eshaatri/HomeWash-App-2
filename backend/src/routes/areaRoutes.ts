import express from "express";
import Area from "../models/Area";

const router = express.Router();

// Get all areas
router.get("/", async (req, res) => {
  try {
    const areas = await Area.find();
    res.json(areas);
  } catch (error) {
    res.status(500).json({
      message: error instanceof Error ? error.message : "Error fetching areas",
    });
  }
});

// Create an area
router.post("/", async (req, res) => {
  try {
    const area = await Area.create(req.body);
    res.status(201).json(area);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error creating area" });
  }
});

// Update an area
router.patch("/:id", async (req, res) => {
  try {
    const area = await Area.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!area) return res.status(404).json({ message: "Area not found" });
    res.json(area);
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error updating area" });
  }
});

// Delete an area
router.delete("/:id", async (req, res) => {
  try {
    const area = await Area.findByIdAndDelete(req.params.id);
    if (!area) return res.status(404).json({ message: "Area not found" });
    res.json({ message: "Area deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Error deleting area" });
  }
});

export default router;
