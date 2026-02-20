import mongoose, { Schema, Document } from "mongoose";

export interface ISubCategory extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
  sectionTitle: string; // "Select Property Type", etc.
  icon: string;
  color: string;
  image?: string;
  originalId?: string; // To keep track of "apartment", "bungalow" etc. for matching
}

const SubCategorySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    sectionTitle: { type: String, default: "General" },
    icon: { type: String, required: true },
    color: { type: String, required: true },
    image: { type: String },
    originalId: { type: String },
  },
  { timestamps: true },
);

export default mongoose.model<ISubCategory>("SubCategory", SubCategorySchema);
