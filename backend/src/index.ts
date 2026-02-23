import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";

// Import Routes
import userRoutes from "./routes/userRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import vendorRoutes from "./routes/vendorRoutes";
import areaRoutes from "./routes/areaRoutes";
import pricingRoutes from "./routes/pricingRoutes";
import subCategoryRoutes from "./routes/subCategoryRoutes";
import vendorConfigRoutes from "./routes/vendorConfigRoutes";
import locationRoutes from "./routes/locationRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/vendor-configs", vendorConfigRoutes);
app.use("/api/location", locationRoutes);

app.get("/", (req, res) => {
  res.send("HomeWash API is running...");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
