// ============================================================
// CARE ROUTE — Eligibility Engine
// ============================================================

import { HospitalProfile, CapacityMetric, SpecialistMetric } from '../../types/hospital';
import { CareRequirement } from '../../types/care';
import { MatchReason } from '../../types/recommendation';
import { calculateDistance } from './etaService';

export function checkEligibility(
  hospital: HospitalProfile,
  capacity: CapacityMetric[],
  specialists: SpecialistMetric[],
  requirements: CareRequirement
): { eligible: boolean; reasons: MatchReason[]; failedSpecialty: boolean; failedResource: boolean } {
  const reasons: MatchReason[] = [];
  let eligible = true;
  let failedSpecialty = false;
  let failedResource = false;

  // 1. Check Distance
  if (requirements.location && hospital.coordinates) {
    const distance = calculateDistance(requirements.location, hospital.coordinates);
    if (distance > requirements.radiusKm) {
      eligible = false;
      reasons.push({ description: `Outside search radius (${requirements.radiusKm}km)`, met: false });
    } else {
      reasons.push({ description: 'Within search radius', met: true });
    }
  }

  // 2. Check Emergency Status if Urgent/Critical
  if (requirements.urgency === 'URGENT' || requirements.urgency === 'CRITICAL') {
    if (hospital.emergencyStatus !== 'OPERATIONAL') {
      eligible = false;
      reasons.push({ description: 'Emergency department not fully operational', met: false });
    } else {
      reasons.push({ description: 'Emergency department operational', met: true });
    }
  }

  // 3. Check Required Resources
  if (requirements.resources && requirements.resources.length > 0) {
    for (const reqResource of requirements.resources) {
      const match = capacity.find(c => c.name.toLowerCase().includes(reqResource.toLowerCase()));
      if (!match || (match.available <= 0 && match.status === 'UNAVAILABLE')) {
        eligible = false;
        failedResource = true;
        reasons.push({ description: `Required resource unavailable: ${reqResource}`, met: false });
      } else {
        reasons.push({ description: `${reqResource} available`, met: true });
      }
    }
  }

  // 4. Check Required Specialists
  if (requirements.specialists && requirements.specialists.length > 0) {
    for (const spec of requirements.specialists) {
      const match = specialists.find(s => s.specialty.toLowerCase() === spec.toLowerCase());
      if (!match || match.status === 'UNAVAILABLE') {
        eligible = false;
        failedSpecialty = true;
        reasons.push({ description: `Specialist unavailable: ${spec}`, met: false });
      } else {
        reasons.push({ description: `${spec} available`, met: true });
      }
    }
  }

  // Ensure reasons doesn't get overwhelmingly long for the UI if everything matches perfectly
  if (eligible && reasons.length === 0) {
    reasons.push({ description: 'Hospital is currently operational', met: true });
  }

  return { eligible, reasons, failedSpecialty, failedResource };
}
