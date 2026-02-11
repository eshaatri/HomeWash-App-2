import express from "express";
import Service from "../models/Service";
import VendorConfig from "../models/VendorConfig";
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

    // 3. Check for any VendorConfig that overrides the price in this area
    // For now, we'll pick the first active vendor config for this service + area.
    // In a mature system, this would involve distribution logic.
    const config = await VendorConfig.findOne({
      serviceId: serviceId as string,
      areaId: (area._id as any).toString(),
      isEnabled: true,
    });

    const finalPrice =
      config && config.customPrice !== undefined
        ? config.customPrice
        : service.price;
    const vendorId =
      config && config.vendorId ? config.vendorId.toString() : null;

    res.json({
      serviceId,
      basePrice: service.price,
      finalPrice,
      vendorId,
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
