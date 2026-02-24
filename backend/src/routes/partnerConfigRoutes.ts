import express from "express";
import PartnerConfig from "../models/PartnerConfig";

const router = express.Router();

// Get all configs for a specific partner
router.get("/partner/:partnerId", async (req, res) => {
  try {
    const configs = await PartnerConfig.find({
      partnerId: req.params.partnerId,
    });
    res.json(configs);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Error fetching partner configs",
    });
  }
});

// Create or Update a config
router.post("/", async (req, res) => {
  const { partnerId, serviceId, areaId, customPrice, isEnabled } = req.body;

  if (!partnerId || !serviceId || !areaId) {
    return res
      .status(400)
      .json({ message: "partnerId, serviceId, and areaId are required" });
  }

  try {
    const config = await PartnerConfig.findOneAndUpdate(
      { partnerId, serviceId, areaId },
      { customPrice, isEnabled },
      { new: true, upsert: true },
    );
    res.json(config);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error saving partner config",
    });
  }
});

// Batch update for a partner (optional but helpful)
router.post("/batch", async (req, res) => {
  const { partnerId, areaId, configs } = req.body; // configs: array of { serviceId, customPrice, isEnabled }

  if (!partnerId || !areaId || !Array.isArray(configs)) {
    return res
      .status(400)
      .json({ message: "partnerId, areaId, and configs array are required" });
  }

  try {
    const operations = configs.map((c) => ({
      updateOne: {
        filter: { partnerId, areaId, serviceId: c.serviceId },
        update: { customPrice: c.customPrice, isEnabled: c.isEnabled },
        upsert: true,
      },
    }));

    await PartnerConfig.bulkWrite(operations);
    res.json({ message: "Batch update successful" });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Error performing batch update",
    });
  }
});

export default router;
