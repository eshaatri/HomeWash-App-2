import mongoose, { Schema, Document, Types } from "mongoose";

export type LeadStatus = "OPEN" | "ACCEPTED" | "EXPIRED" | "DECLINED";

export interface ILead extends Document {
  bookingId: Types.ObjectId;
  professionalId: Types.ObjectId;
  status: LeadStatus;
  wave: number; // 1 = in-house, 2 = closest 10, 3 = everyone else
  createdAt: Date;
  expiresAt: Date;
}

const LeadSchema: Schema = new Schema<ILead>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: "Booking", required: true },
    professionalId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["OPEN", "ACCEPTED", "EXPIRED", "DECLINED"],
      default: "OPEN",
    },
    wave: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  },
);

LeadSchema.index({ bookingId: 1 });
LeadSchema.index({ professionalId: 1 });
LeadSchema.index({ status: 1, expiresAt: 1 });

export default mongoose.model<ILead>("Lead", LeadSchema);

