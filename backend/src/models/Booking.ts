import mongoose, { Schema, Document } from "mongoose";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PARTNER_ASSIGNED = "PARTNER_ASSIGNED",
  PARTNER_EN_ROUTE = "PARTNER_EN_ROUTE",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface IBooking extends Document {
  serviceId: string;
  serviceName: string;
  customerId: string;
  status: BookingStatus;
  date: string;
  time: string;
  amount: number;
  partnerId?: string;
  partnerName?: string;
  partnerImage?: string;
  otp?: string;
  paidAmount?: number;
  remainingAmount?: number;
  vendorId?: string;
  serviceArea?: string;
}

const BookingSchema: Schema = new Schema(
  {
    serviceId: { type: String, required: true },
    serviceName: { type: String, required: true },
    customerId: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(BookingStatus),
      default: BookingStatus.PENDING,
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    amount: { type: Number, required: true },
    partnerId: { type: String },
    partnerName: { type: String },
    partnerImage: { type: String },
    otp: { type: String },
    paidAmount: { type: Number },
    remainingAmount: { type: Number },
    vendorId: { type: String },
    serviceArea: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<IBooking>("Booking", BookingSchema);
