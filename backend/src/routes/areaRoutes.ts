import express from "express";
import Area from "../models/Area";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";

const router = express.Router();

// Check if a location is within any serviceable area
router.get("/check-coverage", async (req, res) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res
      .status(400)
      .json({ message: "Latitude and longitude are required" });
  }

  try {
    const pt = point([Number(lng), Number(lat)]);
    const areas = await Area.find({
      isActive: true,
      assignedPartnerId: { $exists: true, $ne: "" },
      geoJson: { $exists: true, $ne: null },
    });

    for (const area of areas) {
      if (area.geoJson) {
        // Handle both Feature and FeatureCollection
        const features =
          area.geoJson.type === "FeatureCollection"
            ? area.geoJson.features
            : [area.geoJson];

        for (const feature of features) {
          if (booleanPointInPolygon(pt, feature)) {
            return res.json({
              serviceable: true,
              areaId: area._id,
              areaName: area.name,
              city: area.city,
            });
          }
        }
      }
    }

    res.json({ serviceable: false });
  } catch (error) {
    console.error("Coverage check error:", error);
    res.status(500).json({ message: "Error checking service coverage" });
  }
});

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
  console.log(
    `Updating area ${req.params.id} with body keys:`,
    Object.keys(req.body),
    "Body size:",
    JSON.stringify(req.body).length,
  );
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
