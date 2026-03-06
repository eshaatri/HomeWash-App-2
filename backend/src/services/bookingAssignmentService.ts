import { Types } from "mongoose";
import Booking, { BookingStatus, IBooking } from "../models/Booking";
import User from "../models/User";
import Lead, { ILead } from "../models/Lead";
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

export function professionalServesArea(
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
 * Lead-based assignment helpers.
 * We create waves of leads instead of assigning directly.
 */

async function createLeadsForProfessionals(
  booking: IBooking,
  professionalIds: string[],
  wave: number,
  ttlMinutes: number
): Promise<ILead[]> {
  if (professionalIds.length === 0) return [];
  const now = new Date();
  const expiresAt = new Date(now.getTime() + ttlMinutes * 60 * 1000);

  const payloads = professionalIds.map((pid) => ({
    bookingId: booking._id,
    professionalId: new Types.ObjectId(pid),
    wave,
    expiresAt,
  }));

  const leads = await Lead.insertMany(payloads);
  return leads;
}

export async function createInitialLeadsForBooking(
  booking: IBooking
): Promise<void> {
  const serviceArea = booking.serviceArea;
  if (!serviceArea) return;

  const onlineIds = getOnlineProfessionalIds();
  if (onlineIds.length === 0) return;

  const professionals = await User.find({
    _id: { $in: onlineIds },
    role: "PROFESSIONAL",
    status: { $ne: "SUSPENDED" },
  })
    .select(
      "_id name serviceArea serviceAreaIds lastKnownLat lastKnownLng image isInhouse"
    )
    .lean();

  const inArea = professionals.filter((p) =>
    professionalServesArea(p, serviceArea)
  );
  if (inArea.length === 0) return;

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
      bookingLat != null && bookingLng != null && lat != null && lng != null
        ? haversineDistanceKm(bookingLat, bookingLng, lat, lng)
        : Number.MAX_SAFE_INTEGER;
    return { ...p, distance };
  });

  const inhouse = withDistance.filter((p) => (p as any).isInhouse);
  const others = withDistance.filter((p) => !(p as any).isInhouse);

  if (inhouse.length > 0) {
    await createLeadsForProfessionals(
      booking,
      inhouse.map((p) => String(p._id)),
      1,
      5
    );
  } else {
    // No in-house team: send to closest 10 professionals directly
    const sortedOthers = others.sort((a, b) => a.distance - b.distance);
    const closest = sortedOthers.slice(0, 10);
    await createLeadsForProfessionals(
      booking,
      closest.map((p) => String(p._id)),
      2,
      5
    );
  }
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
