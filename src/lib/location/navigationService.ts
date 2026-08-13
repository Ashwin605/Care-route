// ============================================================
// CARE ROUTE — Navigation Service
// ============================================================

import { Location } from '../../types/patient';

export function getDirectionsUrl(destination: Location): string {
  // Uses universal link that resolves to Google Maps or Apple Maps depending on OS
  return `https://www.google.com/maps/dir/?api=1&destination=${destination.lat},${destination.lng}`;
}

export function openDirections(destination: Location): void {
  const url = getDirectionsUrl(destination);
  window.open(url, '_blank', 'noopener,noreferrer');
}
