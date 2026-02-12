import mongoose, { Schema, Document } from "mongoose";

export interface IArea extends Document {
  name: string; // e.g., "Bandra", "Powai"
  city: string;
  zipCodes: string[];
  isActive: boolean;
  assignedVendorId?: string;
  assignedVendorName?: string;
  lat?: number;
  lng?: number;
}

const AreaSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    zipCodes: [{ type: String }],
    isActive: { type: Boolean, default: true },
    assignedVendorId: { type: String },
    assignedVendorName: { type: String },
    lat: { type: Number },
    lng: { type: Number },
  },
  { timestamps: true },
);

export default mongoose.model<IArea>("Area", AreaSchema);
