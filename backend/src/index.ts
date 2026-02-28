import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
import connectDB from "./config/db";

// Import Routes
import userRoutes from "./routes/userRoutes";
import serviceRoutes from "./routes/serviceRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import bookingRoutes from "./routes/bookingRoutes";
import partnerRoutes from "./routes/partnerRoutes";
import areaRoutes from "./routes/areaRoutes";
import pricingRoutes from "./routes/pricingRoutes";
import subCategoryRoutes from "./routes/subCategoryRoutes";
import partnerConfigRoutes from "./routes/partnerConfigRoutes";
import locationRoutes from "./routes/locationRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

// Socket.IO: attach to same server for realtime professional updates
const io = new Server(httpServer, {
  cors: { origin: "*" },
  transports: ["websocket", "polling"],
});

// Store socket id -> professionalId for disconnect and location
const socketToProfessionalId = new Map<string, string>();

import { setProfessionalLocation } from "./services/professionalLocationStore";
import {
  setProfessionalOnline,
  setProfessionalOffline,
} from "./services/onlineProfessionalStore";
import { assignPendingBookingToProfessional } from "./services/bookingAssignmentService";

io.on("connection", (socket) => {
  socket.on("professional:identify", async (payload: { professionalId: string }) => {
    const id = payload?.professionalId;
    if (!id) return;
    socketToProfessionalId.set(socket.id, id);

    const User = (await import("./models/User")).default;
    const user = await User.findById(id).select("status").lean();
    const isOnline = user?.status !== "SUSPENDED";

    io.emit("professional:online", { id, isOnline });
    if (!isOnline) socket.emit("professional:suspended");
  });

  socket.on(
    "professional:setOnline",
    async (payload: { isOnline: boolean }) => {
      const professionalId = socketToProfessionalId.get(socket.id);
      if (professionalId == null || payload?.isOnline === undefined) return;

      const User = (await import("./models/User")).default;
      const user = await User.findById(professionalId).select("status").lean();

      if (user?.status === "SUSPENDED") {
        setProfessionalOffline(professionalId);
        io.emit("professional:online", {
          id: professionalId,
          isOnline: false,
        });
        socket.emit("professional:suspended");
        return;
      }

      if (payload.isOnline) {
        setProfessionalOnline(professionalId);
        try {
          await assignPendingBookingToProfessional(professionalId);
        } catch (err) {
          console.error("Assign pending booking on setOnline:", err);
        }
      } else {
        setProfessionalOffline(professionalId);
      }

      io.emit("professional:online", {
        id: professionalId,
        isOnline: payload.isOnline,
      });
    },
  );

  socket.on(
    "professional:location",
    async (payload: { lat: number; lng: number }) => {
      const professionalId = socketToProfessionalId.get(socket.id);
      if (!professionalId || payload?.lat == null || payload?.lng == null)
        return;
      const { lat, lng } = payload;
      setProfessionalLocation(professionalId, lat, lng);
      try {
        const User = (await import("./models/User")).default;
        await User.findByIdAndUpdate(professionalId, {
          lastKnownLat: lat,
          lastKnownLng: lng,
          lastLocationAt: new Date(),
        });
      } catch (err) {
        console.error("Failed to update professional location:", err);
      }
    },
  );

  socket.on("disconnect", () => {
    const professionalId = socketToProfessionalId.get(socket.id);
    if (professionalId) {
      setProfessionalOffline(professionalId);
      socketToProfessionalId.delete(socket.id);
      io.emit("professional:online", { id: professionalId, isOnline: false });
    }
  });
});

app.set("io", io);

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.use("/api/users", userRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/services", serviceRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/partners", partnerRoutes);
app.use("/api/subcategories", subCategoryRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/partner-configs", partnerConfigRoutes);
app.use("/api/location", locationRoutes);

app.get("/", (req, res) => {
  res.send("HomeWash API is running...");
});

// Health check: verify API and database connection
app.get("/api/health", async (req, res) => {
  const mongoose = await import("mongoose");
  const mongoOk =
    mongoose.connection.readyState === 1; /* 1 = connected */
  res.status(mongoOk ? 200 : 503).json({
    ok: mongoOk,
    mongo: mongoOk ? "connected" : "disconnected",
    readyState: mongoose.connection.readyState,
  });
});

// Connect to DB first, then start server
connectDB()
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Startup failed:", err);
    process.exit(1);
  });
