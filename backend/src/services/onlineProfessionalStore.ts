/**
 * In-memory set of professional IDs that are currently online (connected via socket).
 * Updated from socket handlers; used when assigning new bookings.
 */

const onlineIds = new Set<string>();

export function setProfessionalOnline(professionalId: string) {
  onlineIds.add(professionalId);
}

export function setProfessionalOffline(professionalId: string) {
  onlineIds.delete(professionalId);
}

export function getOnlineProfessionalIds(): string[] {
  return Array.from(onlineIds);
}

export function isProfessionalOnline(professionalId: string): boolean {
  return onlineIds.has(professionalId);
}
