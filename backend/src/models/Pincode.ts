import mongoose, { Schema, Document } from "mongoose";

export interface IPincode extends Document {
  pincode: string;
  state: string;
  district: string;
  boundary: {
    type: string;
    coordinates: any;
  };
}

const PincodeSchema: Schema = new Schema(
  {
    pincode: { type: String, required: true, index: true },
    state: { type: String },
    district: { type: String },
    boundary: {
      type: {
        type: String,
        enum: ["Polygon", "MultiPolygon"],
        required: true,
      },
      coordinates: {
        type: Schema.Types.Mixed,
        required: true,
      },
    },
  },
  { timestamps: true },
);

// Geospatial index for spatial queries
PincodeSchema.index({ boundary: "2dsphere" });

export default mongoose.model<IPincode>("Pincode", PincodeSchema);
