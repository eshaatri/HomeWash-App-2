import mongoose, { Schema, Document } from "mongoose";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  PROFESSIONAL_ASSIGNED = "PROFESSIONAL_ASSIGNED",
  PROFESSIONAL_EN_ROUTE = "PROFESSIONAL_EN_ROUTE",
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
  address?: string;
  professionalId?: string;
  professionalName?: string;
  professionalImage?: string;
  otp?: string;
  paidAmount?: number;
  remainingAmount?: number;
  partnerId?: string;
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
    address: { type: String },
    professionalId: { type: String },
    professionalName: { type: String },
    professionalImage: { type: String },
    otp: { type: String },
    paidAmount: { type: Number },
    remainingAmount: { type: Number },
    partnerId: { type: String },
    serviceArea: { type: String },
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

export default mongoose.model<IBooking>("Booking", BookingSchema);
