// ============================================================
// CARE ROUTE — ETA Service
// ============================================================

import { Location } from '../../types/patient';

// Haversine formula for distance
export function calculateDistance(loc1: Location, loc2: Location): number {
  const R = 6371; // Earth's radius in km
  const dLat = (loc2.lat - loc1.lat) * (Math.PI / 180);
  const dLng = (loc2.lng - loc1.lng) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(loc1.lat * (Math.PI / 180)) *
      Math.cos(loc2.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateETA(distanceKm: number): number {
  // Rough estimate: assume average urban speed of 25 km/h
  // -> roughly 2.4 minutes per km
  // Add a base of 5 minutes for traffic/parking overhead
  return Math.round((distanceKm * 2.4) + 5);
}
