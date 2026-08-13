// ============================================================
// CARE ROUTE — Patient Types
// ============================================================

export interface Location {
  lat: number;
  lng: number;
}

export interface PatientState {
  currentLocation: Location | null;
  locationPermission: 'GRANTED' | 'DENIED' | 'PROMPT';
}
