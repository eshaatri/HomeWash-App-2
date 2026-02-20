import mongoose, { Schema, Document } from "mongoose";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PARTNER = "PARTNER",
  ADMIN = "ADMIN",
}

export interface IUser extends Document {
  name: string;
  phone: string;
  role: UserRole;
  walletBalance: number;
  rating?: number;
  isVerified?: boolean;
  earningsToday?: number;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true, unique: true },
    role: { type: String, enum: Object.values(UserRole), required: true },
    walletBalance: { type: Number, default: 0 },
    rating: { type: Number },
    isVerified: { type: Boolean },
    earningsToday: { type: Number },
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
