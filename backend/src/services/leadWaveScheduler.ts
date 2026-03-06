import { Server } from "socket.io";
import Lead from "../models/Lead";
import Booking, { BookingStatus } from "../models/Booking";
import User from "../models/User";
import { getOnlineProfessionalIds } from "./onlineProfessionalStore";
import { getProfessionalLocation } from "./professionalLocationStore";
import { professionalServesArea } from "./bookingAssignmentService";

const TTL_MINUTES = 5;
const MAX_CLOSEST = 10;
const TICK_MS = 60_000; // run every 60 seconds

function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function startLeadWaveScheduler(io: Server) {
  setInterval(async () => {
    try {
      const now = new Date();

      // Leads whose TTL has passed (used as trigger for expansion)
      const expiredOpenLeads = await Lead.find({
        status: "OPEN",
        expiresAt: { $lte: now },
        wave: { $in: [1, 2] },
      })
        .select("bookingId wave")
        .lean();

      if (expiredOpenLeads.length === 0) return;

      const byBooking = new Map<string, { bookingId: string; wave: number }[]>();
      for (const l of expiredOpenLeads) {
        const key = String(l.bookingId);
        if (!byBooking.has(key)) byBooking.set(key, []);
        byBooking.get(key)!.push({ bookingId: key, wave: l.wave });
      }

      for (const [bookingId, leads] of byBooking.entries()) {
        const booking = await Booking.findById(bookingId);
        if (!booking) continue;
        if (booking.professionalId) continue;
        if (booking.status !== BookingStatus.PENDING) continue;

        const allLeads = await Lead.find({ bookingId }).lean();
        const wavesPresent = new Set(allLeads.map((l) => l.wave));
        if (wavesPresent.has(3)) continue; // already fully expanded

        const highestExpiredWave = Math.max(...leads.map((l) => l.wave));

        let nextWave: 2 | 3 | null = null;
        if (highestExpiredWave === 1 && !wavesPresent.has(2)) {
          // Expand from in-house only to closest 10 others
          nextWave = 2;
        } else if (highestExpiredWave >= 2 && !wavesPresent.has(3)) {
          // Expand from closest 10 to all remaining
          nextWave = 3;
        } else {
          continue;
        }

        const serviceArea = booking.serviceArea;
        if (!serviceArea) continue;

        const onlineIds = getOnlineProfessionalIds();
        if (onlineIds.length === 0) continue;

        const professionals = await User.find({
          _id: { $in: onlineIds },
          role: "PROFESSIONAL",
          status: { $ne: "SUSPENDED" },
        })
          .select(
            "_id serviceArea serviceAreaIds lastKnownLat lastKnownLng isInhouse",
          )
          .lean();

        const inArea = professionals.filter((p) =>
          professionalServesArea(p, serviceArea),
        );
        if (inArea.length === 0) continue;

        const bookingLat = booking.customerLat;
        const bookingLng = booking.customerLng;

        const withDistance = inArea.map((p) => {
          let lat: number | undefined;
          let lng: number | undefined;
          const fromStore = getProfessionalLocation(String(p._id));
          if (fromStore) {
            lat = fromStore.lat;
            lng = fromStore.lng;
          } else {
            lat = (p as any).lastKnownLat;
            lng = (p as any).lastKnownLng;
          }
          const distance =
            bookingLat != null &&
            bookingLng != null &&
            lat != null &&
            lng != null
              ? haversineDistanceKm(bookingLat, bookingLng, lat, lng)
              : Number.MAX_SAFE_INTEGER;
          return { ...p, distance };
        });

        const existingLeadProIds = new Set(
          allLeads.map((l) => String(l.professionalId)),
        );
        const available = withDistance.filter(
          (p) => !existingLeadProIds.has(String(p._id)),
        );
        if (available.length === 0) continue;

        let chosenIds: string[] = [];
        if (nextWave === 2) {
          const others = available.filter((p) => !(p as any).isInhouse);
          const sorted = others.sort((a, b) => a.distance - b.distance);
          chosenIds = sorted.slice(0, MAX_CLOSEST).map((p) => String(p._id));
        } else {
          chosenIds = available.map((p) => String(p._id));
        }

        if (chosenIds.length === 0) continue;

        const expiresAt = new Date(
          now.getTime() + TTL_MINUTES * 60 * 1000,
        );
        const docs = chosenIds.map((pid) => ({
          bookingId: booking._id,
          professionalId: pid,
          wave: nextWave,
          expiresAt,
        }));
        await Lead.insertMany(docs);

        // Notify professionals that a new lead is available; partner app can refetch on this event
        chosenIds.forEach((pid) => {
          io.to(pid).emit("lead:new", { bookingId, wave: nextWave });
        });
      }
    } catch (err) {
      console.error("leadWaveScheduler tick failed:", err);
    }
  }, TICK_MS);
}

