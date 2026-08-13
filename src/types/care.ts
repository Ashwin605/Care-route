// ============================================================
// CARE ROUTE — Care Requirement Types
// ============================================================

import { Location } from './patient';

export type CareType =
  | 'EMERGENCY'
  | 'SPECIALIST'
  | 'GENERAL'
  | 'DIAGNOSTIC'
  | 'SURGERY'
  | 'FOLLOW_UP'
  | 'OTHER'
  | 'UNKNOWN';

export type UrgencyLevel = 'ROUTINE' | 'URGENT' | 'CRITICAL' | 'UNKNOWN';

export interface CareRequirement {
  careType: CareType | null;
  urgency: UrgencyLevel | null;
  resources: string[];
  specialists: string[];
  location: Location | null;
  radiusKm: number;
  accessibilityNeeds: string[];
}
