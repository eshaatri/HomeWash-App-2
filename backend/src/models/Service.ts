import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  title: string;
  price: number;
  originalPrice?: number;
  duration: string;
  description: string;
  rating: number;
  reviewCount: number;
  image: string;
  bestseller?: boolean;
  categoryId: string;
  subCategoryId?: string;
  offerTag?: string;
}

const ServiceSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    duration: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    image: { type: String, required: true },
    bestseller: { type: Boolean, default: false },
    categoryId: { type: String, required: true },
    subCategoryId: { type: String },
    offerTag: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<IService>("Service", ServiceSchema);
