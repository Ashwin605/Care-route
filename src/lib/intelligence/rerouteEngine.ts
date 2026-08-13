import { CareJourney, RerouteEvaluation, RerouteTrigger } from '../../types/journey';
import { analyzeHealthcareNetwork } from './networkAnalyzer';
import { MOCK_HOSPITALS } from '../../data/mockHospitals';
import { MOCK_CAPACITY } from '../../data/mockHospitalCapacity';
import { MOCK_SPECIALISTS } from '../../data/mockSpecialists';
import { CareRequirement } from '../../types/care';

export function evaluateReroute(journey: CareJourney, trigger: RerouteTrigger): RerouteEvaluation {
  // 1. Read original requirements
  let originalReqs: CareRequirement = { resources: [], specialists: [], maxDistance: 50 };
  const reqsStr = localStorage.getItem('careRequirements');
  if (reqsStr) {
    try { originalReqs = JSON.parse(reqsStr); } catch (e) {}
  }

  // 2. Run engine against current network state
  const intel = analyzeHealthcareNetwork(MOCK_HOSPITALS, MOCK_CAPACITY, MOCK_SPECIALISTS, originalReqs);

  // 3. Filter alternatives (exclude current destination, must be eligible, and must not be declined)
  const declined = journey.declinedAlternatives || [];
  const alternatives = intel.recommendations.filter(rec => 
    rec.hospital.id !== journey.destinationHospitalId &&
    rec.eligibility.status === 'ELIGIBLE' &&
    !declined.includes(rec.hospital.id)
  ).map(rec => {
    // 4. Inject Dynamic Comparative Warnings
    const etaDiff = rec.etaMinutes - journey.initialEta;
    if (etaDiff > 0) {
      rec.reasons.push({
        description: `ETA is ${etaDiff} minute${etaDiff > 1 ? 's' : ''} longer than the original route.`,
        met: false // We use `met: false` to render it as a warning in the UI
      });
    }
    const distDiff = parseFloat((rec.distanceKm - journey.recommendationSnapshot.distanceKm).toFixed(1));
    if (distDiff > 2) {
      rec.reasons.push({
        description: `Route is ${distDiff}km further than the original destination.`,
        met: false
      });
    }
    return rec;
  });

  const bestAlternative = alternatives.length > 0 ? alternatives[0] : undefined;

  let decision: RerouteEvaluation['decision'];
  let explanation = '';

  const currentHospitalName = MOCK_HOSPITALS.find(h => h.id === journey.destinationHospitalId)?.name || 'Your current destination';
  const currentScore = intel.candidateStates[journey.destinationHospitalId]?.matchScore || 0;

  if (journey.monitoringStatus === 'STALE' || journey.monitoringStatus === 'ERROR') {
    decision = 'REROUTE_UNCERTAIN';
    explanation = `CARE ROUTE cannot confidently determine whether changing destinations would improve your journey.`;
  } else if (!bestAlternative) {
    decision = 'NO_SUITABLE_ALTERNATIVE';
    explanation = `CARE ROUTE could not identify another suitable hospital using the current network information.`;
  } else if (journey.destinationStatus === 'AT_RISK') {
    // If it's a soft constraint, ensure the alternative is meaningfully better
    if (bestAlternative.matchScore <= currentScore + 5) {
      decision = 'NO_REROUTE_REQUIRED';
      explanation = `Your current destination remains the strongest suitable option.`;
    } else {
      decision = 'REROUTE_RECOMMENDED';
      explanation = `${currentHospitalName} is currently experiencing capacity constraints. ${bestAlternative.hospital.name} currently meets the required care conditions and has an estimated ${bestAlternative.etaMinutes}-minute travel time.`;
    }
  } else {
    // Hard failure (UNAVAILABLE)
    decision = 'REROUTE_RECOMMENDED';
    explanation = `${currentHospitalName} can no longer provide the required capacity. ${bestAlternative.hospital.name} currently meets the required care conditions and has an estimated ${bestAlternative.etaMinutes}-minute travel time.`;
  }

  return {
    journeyId: journey.id,
    evaluatedAt: new Date().toISOString(),
    trigger,
    currentDestinationStatus: journey.destinationStatus,
    alternatives,
    recommendedAlternative: bestAlternative,
    decision,
    explanation
  };
}
