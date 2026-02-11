import mongoose, { Schema, Document } from "mongoose";

export interface IArea extends Document {
  name: string; // e.g., "Bandra", "Powai"
  city: string;
  zipCodes: string[];
  isActive: boolean;
}

const AreaSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    zipCodes: [{ type: String }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model<IArea>("Area", AreaSchema);
