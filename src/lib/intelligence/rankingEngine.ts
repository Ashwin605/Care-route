// ============================================================
// CARE ROUTE — Ranking Engine
// ============================================================

import { HospitalProfile, CapacityMetric, SpecialistMetric } from '../../types/hospital';
import { CareRequirement } from '../../types/care';
import { Recommendation } from '../../types/recommendation';
import { calculateDistance, calculateETA } from './etaService';
import { checkEligibility } from './eligibilityEngine';
import { forecastCapacity } from './capacityForecast';
import { calculateTotalTimeToCare } from './totalTimeToCare';

export function rankHospitals(
  hospitals: HospitalProfile[],
  allCapacity: Record<string, CapacityMetric[]>,
  allSpecialists: Record<string, SpecialistMetric[]>,
  requirements: CareRequirement
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  for (const hospital of hospitals) {
    if (!hospital.coordinates || !requirements.location) continue;

    const capacity = allCapacity[hospital.id] || [];
    const specialists = allSpecialists[hospital.id] || [];

    const { eligible, reasons } = checkEligibility(hospital, capacity, specialists, requirements);

    if (eligible) {
      const distanceKm = calculateDistance(requirements.location, hospital.coordinates);
      const etaMinutes = calculateETA(distanceKm);
      
      let baseScore = 100;
      
      // Penalty for distance
      baseScore -= (distanceKm * 0.5);
      
      // Penalty for low data confidence
      if (hospital.dataConfidence === 'MEDIUM') baseScore -= 5;
      if (hospital.dataConfidence === 'LOW') baseScore -= 15;

      // Bonus for freshness
      const freshnessMs = Date.now() - new Date(hospital.lastUpdate).getTime();
      if (freshnessMs < 60000) baseScore += 5; // Updated < 1 min ago

      let expectedArrivalCapacity;

      // Predict capacity if looking for ICU or Ventilator or Beds
      const coreResource = requirements.resources?.find(r => ['icu', 'ventilator', 'general beds'].includes(r.toLowerCase()));
      if (coreResource) {
        const resMatch = capacity.find(c => c.name.toLowerCase() === coreResource.toLowerCase());
        if (resMatch) {
          const forecast = forecastCapacity(resMatch, etaMinutes);
          expectedArrivalCapacity = {
            resourceName: resMatch.name,
            currentAvailable: forecast.currentAvailable,
            expectedAvailable: forecast.expectedAvailable
          };
          if (forecast.expectedAvailable === 0) {
            baseScore -= 30;
            reasons.push({ description: `Expected to be full upon arrival (${etaMinutes}m ETA)`, met: false });
          } else {
            reasons.push({ description: `Expected to have capacity upon arrival`, met: true });
          }
        }
      }

      const totalTimeToCare = calculateTotalTimeToCare(
        hospital,
        requirements,
        etaMinutes,
        capacity,
        specialists
      );

      // Penalize score slightly based on total expected time so faster paths rank higher
      baseScore -= (totalTimeToCare.totalEstimatedMinutes * 0.5);

      recommendations.push({
        hospitalId: hospital.id,
        hospital,
        matchScore: Math.max(0, Math.min(100, Math.round(baseScore))),
        distanceKm: parseFloat(distanceKm.toFixed(1)),
        etaMinutes,
        reasons,
        expectedArrivalCapacity,
        totalTimeToCare
      });
    }
  }

  // Rank by matchScore descending, then by distance ascending
  return recommendations.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.distanceKm - b.distanceKm;
  });
}
