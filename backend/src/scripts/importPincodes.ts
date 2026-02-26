import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";
import JSONStream = require("JSONStream");
import * as dotenv from "dotenv";
import Pincode from "../models/Pincode";
import connectDB from "../config/db";

dotenv.config();

const importPincodes = async () => {
  try {
    console.log("Connecting to Database...");
    await connectDB();
    console.log("Connected to Database. Checking file...");

    // Optional: Clear existing data before import
    // await Pincode.deleteMany({});

    const filePath = path.join(process.cwd(), "data", "india_pincodes.geojson");
    if (!fs.existsSync(filePath)) {
      console.error(`File not found at: ${filePath}`);
      process.exit(1);
    }
    console.log("Starting pincodes import...");

    const stream = fs.createReadStream(filePath, { encoding: "utf8" });
    const parser = JSONStream.parse("features.*");

    let count = 0;
    let batch: any[] = [];
    const BATCH_SIZE = 500;

    let processing = false;

    stream.pipe(parser);

    parser.on("data", async (feature: any) => {
      parser.pause();

      if (feature.geometry && feature.properties) {
        const pin =
          feature.properties.Pincode ||
          feature.properties.pincode ||
          feature.properties.PINCODE ||
          feature.properties.pin_code;
        const state =
          feature.properties.Circle ||
          feature.properties.Region ||
          feature.properties.ST_NM ||
          feature.properties.state ||
          feature.properties.statename ||
          feature.properties.State;
        const dist =
          feature.properties.Division ||
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
        } catch (err: any) {
          if (err.code === 11000) {
            // Bulk write error for duplicates (ordered: false ignores dups if we handle the throw)
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
        } catch (err: any) {
          if (err.code !== 11000) console.error("Final batch insert error");
        }
      }
      console.log(
        `Import completed successfully! Total processed objects: ${count}.`,
      );
      process.exit(0);
    });

    parser.on("error", (err: any) => {
      console.error("Error parsing JSON:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  }
};

importPincodes();
