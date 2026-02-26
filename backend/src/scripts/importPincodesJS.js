const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const JSONStream = require("JSONStream");
require("dotenv").config();
const { Schema } = mongoose;

const PincodeSchema = new Schema(
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

const Pincode =
  mongoose.models.Pincode || mongoose.model("Pincode", PincodeSchema);

const importPincodes = async () => {
  try {
    console.log("Connecting to Database...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to Database.");

    const filePath = path.join(
      __dirname,
      "..",
      "..",
      "data",
      "india_pincodes.geojson",
    );
    const stream = fs.createReadStream(filePath, { encoding: "utf8" });
    const parser = JSONStream.parse("features.*");

    let count = 0;
    let batch = [];
    const BATCH_SIZE = 500;

    stream.pipe(parser);

    parser.on("data", async (feature) => {
      parser.pause();

      if (feature.geometry && feature.properties) {
        const pin =
          feature.properties.pincode ||
          feature.properties.PINCODE ||
          feature.properties.pin_code;
        const state =
          feature.properties.ST_NM ||
          feature.properties.state ||
          feature.properties.statename ||
          feature.properties.State;
        const dist =
          feature.properties.DISTRICT ||
          feature.properties.district ||
          feature.properties.District;

        if (pin) {
          batch.push({
            pincode: String(pin),
            state: state || "",
            district: dist || "",
            boundary: feature.geometry,
          });
        }
      }

      count++;

      if (batch.length >= BATCH_SIZE) {
        try {
          await Pincode.insertMany(batch, { ordered: false });
          console.log(`Imported ${count} pincodes...`);
        } catch (err) {
          if (err.code === 11000) {
            console.log(
              `Imported ${count} pincodes (Some duplicates ignored)...`,
            );
          } else {
            console.error("Batch insert error:", err.message);
          }
        }
        batch = [];
      }
      parser.resume();
    });

    parser.on("end", async () => {
      if (batch.length > 0) {
        try {
          await Pincode.insertMany(batch, { ordered: false });
          console.log(`Imported remaining pincodes...`);
        } catch (err) {
          if (err.code !== 11000) console.error("Final batch insert error");
        }
      }
      console.log(
        `Import completed successfully! Total processed objects: ${count}.`,
      );
      mongoose.disconnect();
      process.exit(0);
    });

    parser.on("error", (err) => {
      console.error("Error parsing JSON:", err);
      mongoose.disconnect();
      process.exit(1);
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importPincodes();
