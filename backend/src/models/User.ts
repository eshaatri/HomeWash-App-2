import mongoose, { Schema, Document } from "mongoose";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PROFESSIONAL = "PROFESSIONAL",
  PARTNER = "PARTNER",
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
  partnerId?: string;
  serviceArea?: string;
  serviceAreaIds?: string[]; // area IDs this professional serves
  address?: string;
  city?: string;
  status?: string; // e.g. ONBOARDING | ACTIVE | SUSPENDED for professionals
  lastKnownLat?: number;
  lastKnownLng?: number;
  lastLocationAt?: Date;
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
    partnerId: { type: String },
    serviceArea: { type: String },
    serviceAreaIds: [{ type: String }],
    address: { type: String },
    city: { type: String },
    status: { type: String },
    lastKnownLat: { type: Number },
    lastKnownLng: { type: Number },
    lastLocationAt: { type: Date },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret: any) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

export default mongoose.model<IUser>("User", UserSchema);
