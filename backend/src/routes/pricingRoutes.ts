import express from "express";
import Service from "../models/Service";
import PartnerConfig from "../models/PartnerConfig";
import Area from "../models/Area";

const router = express.Router();

// Resolve pricing for a service in a specific area
router.get("/resolve", async (req, res) => {
  const { serviceId, areaName } = req.query;

  if (!serviceId || !areaName) {
    return res
      .status(400)
      .json({ message: "serviceId and areaName are required" });
  }

  try {
    // 1. Find the area ID from the name
    const area = await Area.findOne({ name: areaName as string });
    if (!area) {
      return res.status(404).json({ message: "Area not found" });
    }

    // 2. Get the base service
    const service = await Service.findById(serviceId as string);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // 3. Check for any PartnerConfig that overrides the price in this area
    // For now, we'll pick the first active partner config for this service + area.
    // In a mature system, this would involve distribution logic.
    const config = await PartnerConfig.findOne({
      serviceId: serviceId as string,
      areaId: (area._id as any).toString(),
      isEnabled: true,
    });

    const finalPrice =
      config && config.customPrice !== undefined
        ? config.customPrice
        : service.price;
    const partnerId =
      config && config.partnerId ? config.partnerId.toString() : null;

    res.json({
      serviceId,
      basePrice: service.price,
      finalPrice,
      partnerId,
      areaId: (area._id as any).toString(),
      isOverride: !!(config && config.customPrice !== undefined),
    });
  } catch (error) {
    res.status(500).json({
      message:
        error instanceof Error ? error.message : "Error resolving pricing",
    });
  }
});

export default router;
