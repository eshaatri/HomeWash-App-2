import mongoose, { Schema, Document } from "mongoose";

export interface IPartner extends Document {
  name: string;
  ownerName: string;
  ownerId?: string; // Optional: Refers to a User with role PARTNER
  email: string;
  phone: string;
  address: string;
  activeAreas: string[]; // List of Area IDs or names
  isActive: boolean;
  commissionRate: number; // e.g., 20.0 for 20%
}

const PartnerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    ownerId: { type: String },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
    activeAreas: [{ type: String }],
    isActive: { type: Boolean, default: true },
    commissionRate: { type: Number, default: 20 },
  },
  { timestamps: true },
);

export default mongoose.model<IPartner>("Partner", PartnerSchema);
