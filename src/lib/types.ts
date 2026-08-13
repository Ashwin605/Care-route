// ============================================================
// CARE ROUTE — TypeScript Type Definitions
// ============================================================

export interface Hospital {
  id: string;
  name: string;
  distance: number;       // km
  eta: number;            // minutes
  suitabilityScore: number; // 0–100
  capabilities: HospitalCapability[];
  capacity: CapacityForecast[];
  status: 'available' | 'limited' | 'unavailable';
  lastUpdated: number;    // seconds ago
}

export interface HospitalCapability {
  name: string;
  available: boolean;
  category: 'specialist' | 'equipment' | 'department' | 'service';
}

export interface CapacityForecast {
  label: string;
  timeOffset: number;   // minutes from now
  beds: number;
  trend: 'stable' | 'declining' | 'increasing';
}

export interface Referral {
  id: string;
  status: ReferralStatus;
  patient: PatientSummary;
  hospital: Hospital;
  createdAt: string;
  updatedAt: string;
  timeline: ReferralTimelineEvent[];
}

export type ReferralStatus =
  | 'created'
  | 'requirements_analyzed'
  | 'hospital_matched'
  | 'referral_sent'
  | 'hospital_accepted'
  | 'hospital_declined'
  | 'patient_en_route'
  | 'arrived'
  | 'admitted';

export interface PatientSummary {
  condition: string;
  severity: 'critical' | 'urgent' | 'standard';
  requirements: string[];
}

export interface ReferralTimelineEvent {
  status: ReferralStatus;
  label: string;
  timestamp?: string;
  completed: boolean;
  active: boolean;
}

export interface ReferralRequest {
  condition: string;
  severity: 'critical' | 'urgent' | 'standard';
  requirements: string[];
  eta: number;
  hospital: {
    name: string;
  };
}

export interface NavigationLink {
  label: string;
  href: string;
}

export interface HowItWorksStep {
  number: string;
  title: string;
  description: string;
}

export interface ConceptFlowStep {
  label: string;
  description?: string;
}
