// ============================================================
// CARE ROUTE — Referral Types
// ============================================================

import { CareRequirement } from './care';
import { HospitalProfile } from './hospital';

export type ReferralStatus = 
  | 'DRAFT' 
  | 'PENDING' 
  | 'UNDER_REVIEW' 
  | 'ACCEPTED' 
  | 'DECLINED' 
  | 'CANCELLED' 
  | 'COMPLETED';

export interface Referral {
  id: string;
  patientReference: string; // e.g. "PT-8429" - masks PII
  referrerId: string;
  destinationHospitalId: string;
  destinationHospitalName?: string;
  careRequirement: CareRequirement;
  status: ReferralStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  journeyId?: string; // Links to active CareJourney if accepted
}

export interface ReferralActivity {
  id: string;
  referralId: string;
  timestamp: string;
  type: 'CREATED' | 'RECEIVED' | 'ACCEPTED' | 'DECLINED' | 'JOURNEY_STARTED';
  description: string;
}
