import { Recommendation } from './recommendation';

export type JourneyStatus = 'PLANNED' | 'ACTIVE' | 'ARRIVING' | 'COMPLETED' | 'CANCELLED';
export type DestinationStatus = 'SUITABLE' | 'MONITORING' | 'AT_RISK' | 'UNAVAILABLE' | 'UNKNOWN';
export type MonitoringStatus = 'MONITORING' | 'CHECKING' | 'STALE' | 'ERROR';

export type RerouteState = 
  | 'NO_REROUTE_REQUIRED'
  | 'EVALUATING'
  | 'ALTERNATIVE_FOUND'
  | 'REROUTE_RECOMMENDED'
  | 'PATIENT_CONFIRMATION_REQUIRED'
  | 'REROUTE_ACCEPTED'
  | 'REROUTE_DECLINED'
  | 'NO_SUITABLE_ALTERNATIVE'
  | 'REROUTE_UNCERTAIN'
  | 'REROUTE_FAILED';

export type RerouteTriggerType = 
  | 'DESTINATION_UNAVAILABLE'
  | 'REQUIRED_RESOURCE_UNAVAILABLE'
  | 'REQUIRED_SPECIALIST_UNAVAILABLE'
  | 'CAPACITY_RISK'
  | 'ETA_DETERIORATION'
  | 'DESTINATION_REQUIREMENT_MISMATCH';

export interface RerouteTrigger {
  type: RerouteTriggerType;
  severity: 'WARNING' | 'CRITICAL';
  hospitalId: string;
  reason: string;
  detectedAt: string;
}

export interface RerouteEvaluation {
  journeyId: string;
  evaluatedAt: string;
  trigger: RerouteTrigger;
  currentDestinationStatus: DestinationStatus;
  alternatives: import('./recommendation').RecommendationResult[];
  recommendedAlternative?: import('./recommendation').RecommendationResult;
  decision: RerouteState;
  explanation: string;
}

export interface CareJourney {
  id: string;
  patientId: string;
  origin: {
    lat: number;
    lng: number;
    address?: string;
  };
  destinationHospitalId: string;
  selectedRecommendationId: string; // the hospitalId essentially, or a unique recommendation snapshot ID
  status: JourneyStatus;
  startedAt: string; // ISO string
  estimatedArrival: string; // ISO string
  initialEta: number; // minutes
  currentEta: number; // minutes
  distanceRemaining: number; // km
  progress: number; // 0 - 100 percentage
  destinationStatus: DestinationStatus;
  monitoringStatus: MonitoringStatus;
  
  // The exact conditions when the patient decided to travel
  recommendationSnapshot: import('./recommendation').RecommendationResult;
  
  events: JourneyEvent[];
  latestRerouteEvaluation?: RerouteEvaluation;
  previousDestinations?: {
    hospitalId: string;
    hospitalName: string;
    reroutedAt: string;
    reason: string;
  }[];
  declinedAlternatives?: string[];
  referralId?: string; // Links to originating referral if any
}

export interface JourneyEvent {
  id: string;
  timestamp: string;
  type: 'STARTED' | 'ETA_UPDATED' | 'DESTINATION_STATUS_CHANGED' | 'REROUTED' | 'COMPLETED' | 'CANCELLED' | 'REROUTE_TRIGGERED' | 'ALTERNATIVES_FOUND' | 'REROUTE_RECOMMENDED' | 'REROUTE_ACCEPTED' | 'REROUTE_DECLINED' | 'DESTINATION_CHANGED' | 'ROUTE_UPDATED' | 'REROUTE_FAILED' | 'DESTINATION_VERIFIED' | 'NETWORK_CHANGE_DETECTED';
  description: string;
  data?: any;
}
