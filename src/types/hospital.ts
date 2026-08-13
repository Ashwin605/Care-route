// No imports needed from auth.ts

// ============================================================
// CARE ROUTE — Hospital Operational Types
// ============================================================

export type ResourceStatus = 'AVAILABLE' | 'LIMITED' | 'UNAVAILABLE';
export type NetworkStatus = 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE';

export interface HospitalProfile {
  id: string;
  name: string;
  address?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  networkStatus: NetworkStatus;
  emergencyStatus?: NetworkStatus;
  lastUpdate: string; // ISO string
  dataConfidence: 'HIGH' | 'MEDIUM' | 'LOW';
  accessibilityFeatures?: string[];
}

export interface CapacityMetric {
  id: string;
  name: string;
  total: number;
  occupied: number;
  available: number; // usually total - occupied, but could be overridden
  status?: ResourceStatus; // used if it's a binary/ternary status instead of a count
}

export interface SpecialistMetric {
  id: string;
  specialty: string;
  availableCount: number;
  status: ResourceStatus;
}

export interface DetailedReferral {
  id: string;
  patientId: string;
  age: number;
  urgency: 'CRITICAL' | 'URGENT' | 'STANDARD';
  specialty: string;
  condition: string;
  requiredResources: string[];
  patientETA: number; // minutes
  distance: number; // km
  receivedAt: string; // ISO string
  status: 'AWAITING_RESPONSE' | 'ACCEPTED' | 'DECLINED' | 'REROUTED';
  declineReason?: string;
}

// Global state shape for the Hospital Context
export interface HospitalState {
  profile: HospitalProfile;
  capacity: CapacityMetric[];
  specialists: SpecialistMetric[];
  incomingReferrals: DetailedReferral[];
  referralHistory: DetailedReferral[];
}
