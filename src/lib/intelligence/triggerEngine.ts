import { CareJourney, RerouteTrigger, RerouteTriggerType } from '../../types/journey';
import { CareRequirement } from '../../types/care';
import { analyzeHealthcareNetwork } from './networkAnalyzer';
import { MOCK_HOSPITALS } from '../../data/mockHospitals';
import { MOCK_CAPACITY } from '../../data/mockHospitalCapacity';
import { MOCK_SPECIALISTS } from '../../data/mockSpecialists';

export const TRIGGER_THRESHOLDS = {
  ETA_DETERIORATION_MINS: 15, // Soft trigger if ETA increases by > 15 mins
};

export function detectRerouteTriggers(journey: CareJourney, originalReqs: CareRequirement): RerouteTrigger | null {
  // 1. Evaluate destination against original requirements
  const intel = analyzeHealthcareNetwork(MOCK_HOSPITALS, MOCK_CAPACITY, MOCK_SPECIALISTS, originalReqs);
  const destState = intel.candidateStates[journey.destinationHospitalId];

  if (!destState) {
    return createTrigger('DESTINATION_UNAVAILABLE', 'CRITICAL', journey.destinationHospitalId, 'The destination hospital is currently unavailable.');
  }

  // 2. Hard Triggers (Eligibility drop)
  if (destState.eligibility.status === 'INELIGIBLE') {
    // Check missing resources
    const missingResources = destState.reasons.filter(r => r.code === 'MISSING_RESOURCE');
    if (missingResources.length > 0) {
      return createTrigger('REQUIRED_RESOURCE_UNAVAILABLE', 'CRITICAL', journey.destinationHospitalId, 'The required resources are no longer available at this destination.');
    }
    
    // Check missing specialists
    const missingSpecialist = destState.reasons.filter(r => r.code === 'MISSING_SPECIALIST');
    if (missingSpecialist.length > 0) {
      return createTrigger('REQUIRED_SPECIALIST_UNAVAILABLE', 'CRITICAL', journey.destinationHospitalId, 'The required specialist is currently unavailable.');
    }

    // Generic fallback for hard triggers
    return createTrigger('DESTINATION_REQUIREMENT_MISMATCH', 'CRITICAL', journey.destinationHospitalId, 'Your selected destination may no longer meet your current care requirements.');
  }

  // 3. Soft Triggers (Constraint / Deterioration)
  if (destState.eligibility.status === 'CONSTRAINED') {
    return createTrigger('CAPACITY_RISK', 'WARNING', journey.destinationHospitalId, 'The required capacity at the destination is becoming constrained.');
  }

  if (journey.currentEta > journey.initialEta + TRIGGER_THRESHOLDS.ETA_DETERIORATION_MINS) {
    return createTrigger('ETA_DETERIORATION', 'WARNING', journey.destinationHospitalId, 'The travel time to your destination has significantly increased.');
  }

  return null;
}

function createTrigger(type: RerouteTriggerType, severity: 'WARNING' | 'CRITICAL', hospitalId: string, reason: string): RerouteTrigger {
  return {
    type,
    severity,
    hospitalId,
    reason,
    detectedAt: new Date().toISOString()
  };
}

export function isDuplicateTrigger(journey: CareJourney, trigger: RerouteTrigger): boolean {
  if (!journey.latestRerouteEvaluation) return false;
  
  const lastTrigger = journey.latestRerouteEvaluation.trigger;
  return lastTrigger.type === trigger.type && 
         lastTrigger.severity === trigger.severity && 
         lastTrigger.hospitalId === trigger.hospitalId && 
         lastTrigger.reason === trigger.reason;
}
