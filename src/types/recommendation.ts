// ============================================================
// CARE ROUTE — Recommendation Types
// ============================================================

import { HospitalProfile } from './hospital';
import { TotalTimeToCareResult } from './intelligence';

export interface MatchReason {
  description: string;
  met: boolean;
}

export interface Recommendation {
  hospitalId: string;
  hospital: HospitalProfile;
  matchScore: number; // 0 - 100
  distanceKm: number;
  etaMinutes: number;
  reasons: MatchReason[];
  expectedArrivalCapacity?: {
    resourceName: string;
    currentAvailable: number;
    expectedAvailable: number;
  };
  totalTimeToCare?: TotalTimeToCareResult;
}
