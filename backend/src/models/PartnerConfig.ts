import mongoose, { Schema, Document } from "mongoose";

export interface IPartnerConfig extends Document {
  partnerId: string;
  serviceId: string;
  areaId: string;
  customPrice?: number;
  isEnabled: boolean;
}

const PartnerConfigSchema: Schema = new Schema(
  {
    partnerId: { type: String, required: true },
    serviceId: { type: String, required: true },
    areaId: { type: String, required: true },
    customPrice: { type: Number },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Unique index to prevent duplicate configs for same partner + service + area
PartnerConfigSchema.index(
  { partnerId: 1, serviceId: 1, areaId: 1 },
  { unique: true },
);

export default mongoose.model<IPartnerConfig>(
  "PartnerConfig",
  PartnerConfigSchema,
);
