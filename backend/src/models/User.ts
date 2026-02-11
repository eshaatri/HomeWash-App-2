import mongoose, { Schema, Document } from "mongoose";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PARTNER = "PARTNER",
  VENDOR = "VENDOR",
  ADMIN = "ADMIN",
}

export interface IUser extends Document {
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  walletBalance: number;
  rating?: number;
  isVerified?: boolean;
  earningsToday?: number;
  vendorId?: string;
  serviceArea?: string;
  city?: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    email: { type: String },
    role: { type: String, enum: Object.values(UserRole), required: true },
    walletBalance: { type: Number, default: 0 },
    rating: { type: Number },
    isVerified: { type: Boolean },
    earningsToday: { type: Number },
    vendorId: { type: String },
    serviceArea: { type: String },
    city: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<IUser>("User", UserSchema);
