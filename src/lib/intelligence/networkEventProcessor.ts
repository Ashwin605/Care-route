import { NetworkEvent } from '../../data/mockEvents';
import { CareJourney, DestinationStatus } from '../../types/journey';
import { getActiveJourney, saveActiveJourney } from '../journeyState';
import { analyzeHealthcareNetwork } from './networkAnalyzer';
import { MOCK_HOSPITALS } from '../../data/mockHospitals';
import { MOCK_CAPACITY } from '../../data/mockHospitalCapacity';
import { MOCK_SPECIALISTS } from '../../data/mockSpecialists';
import { CareRequirement } from '../../types/care';
import { evaluateReroute } from './rerouteEngine';
import { detectRerouteTriggers, isDuplicateTrigger } from './triggerEngine';
import { v4 as uuidv4 } from 'uuid';

export function processNetworkEventForJourneys(event: NetworkEvent): CareJourney[] {
  const activeJourney = getActiveJourney();
  
  // 1. Validate if we have a journey to process
  if (!activeJourney || activeJourney.status === 'COMPLETED' || activeJourney.status === 'CANCELLED') {
    return [];
  }

  // 2. Filter: Only evaluate if the event is related to the destination hospital
  if (event.hospitalId !== activeJourney.destinationHospitalId) {
    return [];
  }

  // 3. Re-evaluate destination using existing matching engine
  let reqs: CareRequirement = { resources: [], specialists: [], maxDistance: 50 };
  const reqsStr = localStorage.getItem('careRequirements');
  if (reqsStr) {
    try { reqs = JSON.parse(reqsStr); } catch (e) {}
  }

  // Additional Filter: If resource/specialist event, check if it's even required
  if (event.resourceId && !reqs.resources.includes(event.resourceId)) {
    return [];
  }
  if (event.specialistId && !reqs.specialists.includes(event.specialistId)) {
    return [];
  }

  // Run full evaluation
  const intel = analyzeHealthcareNetwork(MOCK_HOSPITALS, MOCK_CAPACITY, MOCK_SPECIALISTS, reqs);
  const destState = intel.candidateStates[activeJourney.destinationHospitalId];

  if (!destState) return [];

  // 4. Map Network Engine status to Journey Destination Status
  let newStatus: DestinationStatus = 'SUITABLE';
  if (destState.eligibility.status === 'INELIGIBLE') {
    newStatus = 'UNAVAILABLE';
  } else if (destState.eligibility.status === 'CONSTRAINED') {
    newStatus = 'AT_RISK';
  }

  // 5. Apply changes if status drifted from current snapshot
  if (newStatus !== activeJourney.destinationStatus) {
    const reasons = destState.reasons.map(r => r.description).concat(destState.missingRequirements);
    
    activeJourney.destinationStatus = newStatus;
    activeJourney.events.push({
      id: uuidv4(),
      timestamp: new Date().toISOString(),
      type: 'DESTINATION_STATUS_CHANGED',
      description: `Status changed from ${activeJourney.destinationStatus} to ${newStatus}`,
      data: { reasons, triggeringEventId: event.id }
    });
    
    // 6. Rerouting Foundation: Trigger Reroute Evaluation using robust Trigger Engine
    const trigger = detectRerouteTriggers(activeJourney, reqs);
    if (trigger && !isDuplicateTrigger(activeJourney, trigger)) {
       activeJourney.latestRerouteEvaluation = evaluateReroute(activeJourney, trigger);
    }

    saveActiveJourney(activeJourney);
    
    // Dispatch a custom window event so the active journey UI instantly picks it up
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('careRouteJourneyUpdated'));
    }

    return [activeJourney];
  }

  return [];
}
