/**
 * In-memory store for professionals' latest GPS location.
 * Used for assigning new bookings by proximity.
 */

const professionalLocationMap = new Map<
  string,
  { lat: number; lng: number; updatedAt: Date }
>();

export function setProfessionalLocation(
  professionalId: string,
  lat: number,
  lng: number,
) {
  professionalLocationMap.set(professionalId, {
    lat,
    lng,
    updatedAt: new Date(),
  });
}

export function getProfessionalLocation(professionalId: string) {
  return professionalLocationMap.get(professionalId) ?? null;
}
