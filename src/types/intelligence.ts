import { HospitalProfile, CapacityMetric, SpecialistMetric } from './hospital';
import { CareRequirement } from './care';
import { Recommendation, MatchReason } from './recommendation';

export type HospitalCandidateState = 
  | 'ELIGIBLE' 
  | 'AT_RISK' 
  | 'INELIGIBLE' 
  | 'RECOMMENDED' 
  | 'STALE_DATA' 
  | 'UNAVAILABLE';

export type ForecastConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export type CapacityPressure = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export type DataFreshnessState = 'FRESH' | 'RECENT' | 'STALE' | 'UNKNOWN';

export const DataFreshnessThresholds = {
  FRESH_SECONDS: 60, // Under 1 minute is FRESH
  RECENT_SECONDS: 300, // Under 5 minutes is RECENT
  // Over 5 minutes is STALE
};

export function getFreshnessState(lastUpdateISO: string): { state: DataFreshnessState, secondsAgo: number } {
  if (!lastUpdateISO) return { state: 'UNKNOWN', secondsAgo: 0 };
  
  const diffMs = Date.now() - new Date(lastUpdateISO).getTime();
  const secondsAgo = Math.floor(diffMs / 1000);
  
  if (secondsAgo < 0) return { state: 'UNKNOWN', secondsAgo: 0 };
  if (secondsAgo <= DataFreshnessThresholds.FRESH_SECONDS) return { state: 'FRESH', secondsAgo };
  if (secondsAgo <= DataFreshnessThresholds.RECENT_SECONDS) return { state: 'RECENT', secondsAgo };
  return { state: 'STALE', secondsAgo };
}

export interface DecisionTraceEvent {
  timestamp: string; // HH:mm format for demo
  description: string;
}

export interface NetworkSummary {
  totalHospitals: number;
  specialtyMatched: number;
  resourceMatched: number;
  capacityMatched: number;
  highConfidenceMatches: number;
  resilienceScore: ResilienceScore;
  lastUpdated: string;
}

export interface WhatIfOverrides {
  capacityDeltas: Record<string, Record<string, number>>; // hospitalId -> resourceName -> delta
  trafficMultiplier: number; // e.g. 1.0 = normal, 1.5 = +50% traffic
  specialistUnavailability: string[]; // List of specialist names to simulate as unavailable
  disabledHospitals: string[]; // List of hospital IDs to simulate as offline
}

export type ResilienceScore = 'HIGH' | 'MEDIUM' | 'LOW';

export interface CapacityTrajectoryPoint {
  timeLabel: string; // '-60m', 'NOW', '+15m', etc.
  expectedAvailable: number;
  trend: 'STABLE' | 'DECLINING' | 'INCREASING';
  isHistorical?: boolean;
}

export interface HospitalLoadIntelligence {
  pressure: CapacityPressure;
  trendDescription: string;
  historicalData: CapacityTrajectoryPoint[];
  forecastData: CapacityTrajectoryPoint[];
}

export interface TotalTimeToCareResult {
  travelMinutes: number;
  estimatedIntakeMinutes: number;
  resourceAvailabilityFactor: number;
  specialistAvailabilityFactor: number;
  totalEstimatedMinutes: number;
  confidence: ForecastConfidence;
  explanation: string;
}

export interface IntelligenceResult {
  nearbyHospitals: HospitalProfile[];
  eligibleHospitals: HospitalProfile[];
  atRiskHospitals: HospitalProfile[];
  ineligibleHospitals: HospitalProfile[];
  recommendedHospital: Recommendation | null;
  alternatives: Recommendation[];
  decisionTrace: DecisionTraceEvent[];
  networkSummary: NetworkSummary;
  candidateStates: Record<string, HospitalCandidateState>;
  capacityTrajectories: Record<string, Record<string, CapacityTrajectoryPoint[]>>; // hospitalId -> resource -> trajectory (deprecated in favor of loadIntelligence)
  loadIntelligence: Record<string, Record<string, HospitalLoadIntelligence>>; // hospitalId -> resource -> intelligence
  explanations: Record<string, string>; // hospitalId -> human readable explanation
  allReasons: Record<string, MatchReason[]>; // hospitalId -> all evaluated reasons
}
