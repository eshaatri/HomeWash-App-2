import mongoose, { Schema, Document } from "mongoose";

export interface IVendorConfig extends Document {
  vendorId: string;
  serviceId: string;
  areaId: string;
  customPrice?: number;
  isEnabled: boolean;
}

const VendorConfigSchema: Schema = new Schema(
  {
    vendorId: { type: String, required: true },
    serviceId: { type: String, required: true },
    areaId: { type: String, required: true },
    customPrice: { type: Number },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Unique index to prevent duplicate configs for same vendor + service + area
VendorConfigSchema.index(
  { vendorId: 1, serviceId: 1, areaId: 1 },
  { unique: true },
);

export default mongoose.model<IVendorConfig>(
  "VendorConfig",
  VendorConfigSchema,
);
