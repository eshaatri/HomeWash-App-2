import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/homewash";

const connectDB = async (): Promise<void> => {
  try {
    const conn = await mongoose.connect(MONGODB_URI);
    const dbName = conn.connection.db?.databaseName ?? "unknown";
    console.log(
      `MongoDB Connected: ${conn.connection.host} (db: ${dbName})`,
    );
  } catch (error) {
    console.error(
      "MongoDB connection failed:",
      error instanceof Error ? error.message : error,
    );
    console.error(
      "Using URI:",
      MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@"),
    );
    process.exit(1);
  }
};

export default connectDB;
export { MONGODB_URI };
