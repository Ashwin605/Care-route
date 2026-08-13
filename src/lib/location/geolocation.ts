// ============================================================
// CARE ROUTE — Geolocation Service
// ============================================================

import { Location } from '../../types/patient';

export async function getCurrentLocation(): Promise<Location> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // Persist for journey origin
        try { localStorage.setItem('careRoute_userLocation', JSON.stringify(loc)); } catch (e) {}
        resolve(loc);
      },
      (error) => {
        reject(error);
      }
    );
  });
}
