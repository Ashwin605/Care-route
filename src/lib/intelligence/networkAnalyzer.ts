// ============================================================
// CARE ROUTE — Network Analyzer Engine
// ============================================================

import { HospitalProfile, CapacityMetric, SpecialistMetric } from '../../types/hospital';
import { CareRequirement } from '../../types/care';
import { 
  IntelligenceResult, 
  WhatIfOverrides, 
  HospitalCandidateState, 
  DecisionTraceEvent,
  NetworkSummary
} from '../../types/intelligence';
import { calculateDistance, calculateETA } from './etaService';
import { checkEligibility } from './eligibilityEngine';
import { analyzeHospitalLoad } from './capacityForecast';
import { generateExplanation } from './decisionExplanation';
import { Recommendation } from '../../types/recommendation';
import { calculateTotalTimeToCare } from './totalTimeToCare';

export function analyzeHealthcareNetwork(
  hospitals: HospitalProfile[],
  allCapacity: Record<string, CapacityMetric[]>,
  allSpecialists: Record<string, SpecialistMetric[]>,
  requirements: CareRequirement,
  overrides?: WhatIfOverrides
): IntelligenceResult {
  const trace: DecisionTraceEvent[] = [];
  const now = new Date();
  
  const addTrace = (desc: string) => {
    trace.push({
      timestamp: `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`,
      description: desc
    });
  };

  addTrace('Patient location detected');
  addTrace(`${hospitals.length} hospitals identified in regional network`);

  const eligibleHospitals: HospitalProfile[] = [];
  const atRiskHospitals: HospitalProfile[] = [];
  const ineligibleHospitals: HospitalProfile[] = [];
  const candidateStates: Record<string, HospitalCandidateState> = {};
  const loadIntelligence: IntelligenceResult['loadIntelligence'] = {};
  const recommendations: Recommendation[] = [];
  const allReasons: Record<string, MatchReason[]> = {};

  let specialtyMatchedCount = 0;
  let resourceMatchedCount = 0;
  let highConfidenceCount = 0;

  for (const hospital of hospitals) {
    if (!hospital.coordinates || !requirements.location) {
      candidateStates[hospital.id] = 'INELIGIBLE';
      continue;
    }

    const baseCapacity = allCapacity[hospital.id] || [];
    const baseSpecialists = allSpecialists[hospital.id] || [];

    // --- APPLY WHAT-IF OVERRIDES ---
    if (overrides?.disabledHospitals?.includes(hospital.id)) {
      candidateStates[hospital.id] = 'UNAVAILABLE';
      continue;
    }

    const capacity = baseCapacity.map(c => {
      const delta = overrides?.capacityDeltas?.[hospital.id]?.[c.name] || 0;
      return { ...c, available: Math.max(0, c.available + delta) };
    });

    const specialists = baseSpecialists.map(s => {
      if (overrides?.specialistUnavailability?.includes(s.specialty)) {
        return { ...s, status: 'UNAVAILABLE' as const };
      }
      return s;
    });

    const trafficMult = overrides?.trafficMultiplier || 1.0;

    // --- ETA ---
    const distanceKm = calculateDistance(requirements.location, hospital.coordinates);
    const baseEta = calculateETA(distanceKm);
    const etaMinutes = Math.round(baseEta * trafficMult);

    // --- ELIGIBILITY ---
    const { eligible, reasons, failedSpecialty, failedResource } = checkEligibility(hospital, capacity, specialists, requirements);
    allReasons[hospital.id] = reasons;

    if (!failedSpecialty) specialtyMatchedCount++;
    if (!failedSpecialty && !failedResource) resourceMatchedCount++;

    if (!eligible) {
      candidateStates[hospital.id] = 'INELIGIBLE';
      ineligibleHospitals.push(hospital);
      continue;
    }

    // --- 4. ACCESSIBILITY COMPATIBILITY ---
    if (requirements.accessibilityNeeds && requirements.accessibilityNeeds.length > 0) {
      const hospitalFeatures = hospital.accessibilityFeatures || [];
      const hasAllNeeds = requirements.accessibilityNeeds.every(need => hospitalFeatures.includes(need));
      
      if (!hasAllNeeds) {
        candidateStates[hospital.id] = 'INELIGIBLE';
        reasons.push({ description: 'Required accessibility feature is unavailable', met: false });
        ineligibleHospitals.push(hospital);
        // Fail early
        continue;
      } else {
        reasons.push({ description: 'All required accessibility features available', met: true });
      }
    }

    // --- 5. CURRENT CAPACITY VERIFICATION ---
    let expectedArrivalCapacity;
    let isAtRisk = false;
    loadIntelligence[hospital.id] = {};

    // Analyze load for ALL capacities
    for (const c of capacity) {
      const delta = overrides?.capacityDeltas?.[hospital.id]?.[c.name] || 0;
      loadIntelligence[hospital.id][c.name] = analyzeHospitalLoad(hospital.id, c, etaMinutes, delta);
    }

    const coreResource = requirements.resources?.find(r => ['icu', 'ventilator', 'general beds'].includes(r.toLowerCase()));
    if (coreResource) {
      const resMatch = capacity.find(c => c.name.toLowerCase() === coreResource.toLowerCase());
      if (resMatch) {
        const intel = loadIntelligence[hospital.id][resMatch.name];
        
        // Find the arrival point from forecastData
        const arrivalPoint = intel.forecastData[intel.forecastData.length - 1];
        
        expectedArrivalCapacity = {
          resourceName: resMatch.name,
          currentAvailable: resMatch.available,
          expectedAvailable: arrivalPoint.expectedAvailable
        };

        if (arrivalPoint.expectedAvailable <= 0 || intel.pressure === 'CRITICAL') {
          isAtRisk = true;
          reasons.push({ description: `Expected to be full upon arrival (${etaMinutes}m ETA)`, met: false });
        } else {
          reasons.push({ description: `Expected to have capacity upon arrival`, met: true });
        }
      }
    }

    // --- STATE ASSIGNMENT ---
    if (hospital.dataConfidence === 'LOW') {
      candidateStates[hospital.id] = 'STALE_DATA';
    } else if (isAtRisk) {
      candidateStates[hospital.id] = 'AT_RISK';
      atRiskHospitals.push(hospital);
    } else {
      candidateStates[hospital.id] = 'ELIGIBLE';
      eligibleHospitals.push(hospital);
      if (hospital.dataConfidence === 'HIGH') highConfidenceCount++;
    }

    // --- SCORING ---
    let matchScore = 100 - (distanceKm * 0.5);
    if (hospital.dataConfidence === 'MEDIUM') matchScore -= 5;
    if (hospital.dataConfidence === 'LOW') matchScore -= 15;
    if (isAtRisk) matchScore -= 40;

    // --- GUIDED CARE DISCOVERY ("I'm not sure") ---
    if (requirements.careType === 'UNKNOWN') {
      const hasEmergency = capacity.some(c => c.name.toLowerCase().includes('emergency') && c.available > 0);
      const hasGeneralMed = capacity.some(c => c.name.toLowerCase().includes('general') && c.available > 0);
      const specialistCount = specialists.filter(s => s.status !== 'UNAVAILABLE').length;

      if (hasEmergency) matchScore += 10;
      if (hasGeneralMed) matchScore += 10;
      matchScore += Math.min(10, specialistCount * 2); // Up to 10 points for having many specialists

      if (hasEmergency || hasGeneralMed) {
        reasons.push({ description: 'Capable of broad general and emergency assessment', met: true });
      }
    }

    const totalTimeToCare = calculateTotalTimeToCare(
      hospital,
      requirements,
      etaMinutes,
      capacity,
      specialists
    );
    matchScore -= (totalTimeToCare.totalEstimatedMinutes * 0.5);

    recommendations.push({
      hospitalId: hospital.id,
      hospital,
      matchScore: Math.max(0, Math.min(100, Math.round(matchScore))),
      distanceKm: parseFloat(distanceKm.toFixed(1)),
      etaMinutes,
      reasons,
      expectedArrivalCapacity,
      totalTimeToCare
    });
  }

  // --- RANKING ---
  recommendations.sort((a, b) => {
    if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
    return a.distanceKm - b.distanceKm;
  });

  // --- FALLBACK: If strict matching found fewer than 2 results, add nearest hospitals ---
  if (recommendations.length < 2 && requirements.location) {
    const MIN_RESULTS = 2;
    const existingIds = new Set(recommendations.map(r => r.hospitalId));
    
    // Sort all hospitals by distance and add the closest ones as fallbacks
    const sortedByDistance = hospitals
      .filter(h => h.coordinates && !existingIds.has(h.id))
      .map(h => ({
        hospital: h,
        distance: calculateDistance(requirements.location!, h.coordinates!),
      }))
      .sort((a, b) => a.distance - b.distance);

    for (const { hospital, distance } of sortedByDistance) {
      if (recommendations.length >= MIN_RESULTS) break;
      
      const etaMinutes = Math.round(calculateETA(distance) * (overrides?.trafficMultiplier || 1.0));
      const fallbackReasons = [{ description: 'Added as nearest available option (relaxed criteria)', met: true }];
      allReasons[hospital.id] = fallbackReasons;
      candidateStates[hospital.id] = 'ELIGIBLE';

      recommendations.push({
        hospitalId: hospital.id,
        hospital,
        matchScore: Math.max(10, 50 - distance),
        distanceKm: parseFloat(distance.toFixed(1)),
        etaMinutes,
        reasons: fallbackReasons,
      });
    }
    
    if (recommendations.length > 1) {
      addTrace(`Added ${recommendations.length - existingIds.size} nearest hospitals as fallback options`);
    }
  }

  addTrace(`${specialtyMatchedCount} hospitals matched specialty requirements`);
  addTrace(`${resourceMatchedCount} hospitals matched required resources`);
  if (overrides && overrides.trafficMultiplier !== 1) {
    addTrace(`Simulated traffic applied (${overrides.trafficMultiplier}x)`);
  }
  addTrace('Capacity forecast calculated for ETA');

  // Always recommend the top-scoring hospital if any exist
  const recommendedRec = recommendations.length > 0 ? recommendations[0] : null;
  const alternatives = recommendedRec ? recommendations.slice(1) : recommendations;

  if (recommendedRec) {
    candidateStates[recommendedRec.hospitalId] = 'RECOMMENDED';
    addTrace(`${recommendedRec.hospital.name} selected as best match`);
  }

  const explanations: Record<string, string> = {};
  for (const rec of recommendations) {
    explanations[rec.hospitalId] = generateExplanation(rec, requirements);
  }

  // --- RESILIENCE SCORING ---
  let resilienceScore: 'HIGH' | 'MEDIUM' | 'LOW' = 'LOW';
  if (alternatives.length >= 3) {
    resilienceScore = 'HIGH';
  } else if (alternatives.length >= 1) {
    resilienceScore = 'MEDIUM';
  }

  const networkSummary: NetworkSummary = {
    totalHospitals: hospitals.length,
    specialtyMatched: specialtyMatchedCount,
    resourceMatched: resourceMatchedCount,
    capacityMatched: eligibleHospitals.length,
    highConfidenceMatches: highConfidenceCount,
    resilienceScore,
    lastUpdated: new Date().toISOString()
  };

  return {
    nearbyHospitals: hospitals,
    eligibleHospitals,
    atRiskHospitals,
    ineligibleHospitals,
    recommendedHospital: recommendedRec,
    alternatives,
    decisionTrace: trace,
    networkSummary,
    candidateStates,
    capacityTrajectories: {}, // deprecated
    loadIntelligence,
    explanations,
    allReasons
  };
}
