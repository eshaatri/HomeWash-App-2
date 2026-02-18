import express from "express";
import VendorConfig from "../models/VendorConfig";

const router = express.Router();

// Get all configs for a specific vendor
router.get("/vendor/:vendorId", async (req, res) => {
  try {
    const configs = await VendorConfig.find({ vendorId: req.params.vendorId });
    res.json(configs);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Error fetching vendor configs",
    });
  }
});

// Create or Update a config
router.post("/", async (req, res) => {
  const { vendorId, serviceId, areaId, customPrice, isEnabled } = req.body;

  if (!vendorId || !serviceId || !areaId) {
    return res
      .status(400)
      .json({ message: "vendorId, serviceId, and areaId are required" });
  }

  try {
    const config = await VendorConfig.findOneAndUpdate(
      { vendorId, serviceId, areaId },
      { customPrice, isEnabled },
      { new: true, upsert: true },
    );
    res.json(config);
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error saving vendor config",
    });
  }
});

// Batch update for a vendor (optional but helpful)
router.post("/batch", async (req, res) => {
  const { vendorId, areaId, configs } = req.body; // configs: array of { serviceId, customPrice, isEnabled }

  if (!vendorId || !areaId || !Array.isArray(configs)) {
    return res
      .status(400)
      .json({ message: "vendorId, areaId, and configs array are required" });
  }

  try {
    const operations = configs.map((c) => ({
      updateOne: {
        filter: { vendorId, areaId, serviceId: c.serviceId },
        update: { customPrice: c.customPrice, isEnabled: c.isEnabled },
        upsert: true,
      },
    }));

    await VendorConfig.bulkWrite(operations);
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
