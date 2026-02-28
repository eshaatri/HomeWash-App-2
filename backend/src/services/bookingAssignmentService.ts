/**
 * Assigns new bookings to the closest online professional in the same service area.
 * If no one is online, booking stays PENDING until a professional goes online.
 */

import Booking, { BookingStatus, IBooking } from "../models/Booking";
import User from "../models/User";
import { getOnlineProfessionalIds } from "./onlineProfessionalStore";
import { getProfessionalLocation } from "./professionalLocationStore";

function haversineDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
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

function professionalServesArea(
  professional: { serviceArea?: string; serviceAreaIds?: string[] },
  bookingServiceArea: string | undefined
): boolean {
  if (!bookingServiceArea) return false;
  const area = professional.serviceArea?.trim();
  if (area === bookingServiceArea) return true;
  const areas = professional.serviceArea
    ? professional.serviceArea.split(",").map((s) => s.trim())
    : [];
  if (areas.includes(bookingServiceArea)) return true;
  const ids = professional.serviceAreaIds || [];
  if (ids.includes(bookingServiceArea)) return true;
  return false;
}

/**
 * Try to assign a newly created booking to the closest online professional in the same service area.
 * If none is online, the booking remains PENDING.
 */
export async function tryAssignBookingToClosestOnline(
  booking: IBooking
): Promise<IBooking | null> {
  const serviceArea = booking.serviceArea;
  if (!serviceArea) return null;

  const onlineIds = getOnlineProfessionalIds();
  if (onlineIds.length === 0) return null;

  const professionals = await User.find({
    _id: { $in: onlineIds },
    role: "PROFESSIONAL",
    status: { $ne: "SUSPENDED" },
  })
    .select("_id name serviceArea serviceAreaIds lastKnownLat lastKnownLng image")
    .lean();

  const inArea = professionals.filter((p) =>
    professionalServesArea(p, serviceArea)
  );
  if (inArea.length === 0) return null;

  const bookingLat = booking.customerLat;
  const bookingLng = booking.customerLng;

  let closest: { id: string; name: string; image?: string; distance: number } | null =
    null;

  for (const p of inArea) {
    let lat: number | undefined;
    let lng: number | undefined;
    const fromStore = getProfessionalLocation(String(p._id));
    if (fromStore) {
      lat = fromStore.lat;
      lng = fromStore.lng;
    } else {
      lat = p.lastKnownLat;
      lng = p.lastKnownLng;
    }
    if (lat == null || lng == null) continue;

    const distance =
      bookingLat != null && bookingLng != null
        ? haversineDistanceKm(bookingLat, bookingLng, lat, lng)
        : 0;

    if (closest == null || distance < closest.distance) {
      closest = {
        id: String(p._id),
        name: p.name,
        image: (p as any).image,
        distance,
      };
    }
  }

  if (!closest) return null;

  const updated = await Booking.findByIdAndUpdate(
    booking._id,
    {
      professionalId: closest.id,
      professionalName: closest.name,
      professionalImage: closest.image,
      status: BookingStatus.PROFESSIONAL_ASSIGNED,
    },
    { new: true }
  );
  return updated;
}

/**
 * When a professional comes online, assign one PENDING booking in their service area to them (oldest first).
 * Uses findOneAndUpdate to avoid double-assignment when multiple pros go online at once.
 */
export async function assignPendingBookingToProfessional(
  professionalId: string
): Promise<IBooking | null> {
  const user = await User.findById(professionalId)
    .select("name serviceArea serviceAreaIds image")
    .lean();
  if (!user) return null;

  const areas: string[] = [];
  if (user.serviceArea) {
    user.serviceArea
      .split(",")
      .map((s) => s.trim())
      .forEach((a) => areas.push(a));
  }
  (user.serviceAreaIds || []).forEach((id) => areas.push(id));
  const uniqueAreas = [...new Set(areas)].filter(Boolean);
  if (uniqueAreas.length === 0) return null;

  const booking = await Booking.findOneAndUpdate(
    {
      status: BookingStatus.PENDING,
      professionalId: { $in: [null, ""] },
      serviceArea: { $in: uniqueAreas },
    },
    {
      professionalId,
      professionalName: user.name,
      professionalImage: (user as any).image,
      status: BookingStatus.PROFESSIONAL_ASSIGNED,
    },
    { new: true, sort: { createdAt: 1 } }
  );
  return booking;
}
