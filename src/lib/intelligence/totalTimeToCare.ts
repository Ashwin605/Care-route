import { HospitalProfile, CapacityMetric, SpecialistMetric } from '../../types/hospital';
import { CareRequirement } from '../../types/care';
import { TotalTimeToCareResult, ForecastConfidence } from '../../types/intelligence';
import { estimateIntakeTime } from './intakeEstimator';

export function calculateTotalTimeToCare(
  hospital: HospitalProfile,
  requirements: CareRequirement,
  etaMinutes: number,
  capacity: CapacityMetric[],
  specialists: SpecialistMetric[]
): TotalTimeToCareResult {
  // 1. Travel Time
  const travelMinutes = Math.round(etaMinutes);

  // 2. Expected Arrival/Intake Time
  const estimatedIntakeMinutes = estimateIntakeTime(hospital, capacity, requirements.urgency);

  // 3. Resource Availability Factor
  // Simple heuristic: if core resources are heavily occupied, add a delay factor.
  let resourceAvailabilityFactor = 0;
  if (requirements.resources && requirements.resources.length > 0) {
    const requiredCap = capacity.find(c => requirements.resources.includes(c.name));
    if (requiredCap && requiredCap.total > 0) {
      if (requiredCap.available === 0) {
        resourceAvailabilityFactor = 15; // High penalty for zero beds
      } else if (requiredCap.available === 1) {
        resourceAvailabilityFactor = 5;
      }
    }
  }

  // 4. Specialist Availability Factor
  // 4. Specialist Availability Factor
  let specialistAvailabilityFactor = 0;
  if (requirements.specialists && requirements.specialists.length > 0) {
    requirements.specialists.forEach(specName => {
      const spec = specialists.find(s => s.specialty === specName);
      if (!spec || spec.status === 'UNAVAILABLE') {
        specialistAvailabilityFactor += 20; // High penalty if specialist isn't there
      } else if (spec.status === 'LIMITED') {
        specialistAvailabilityFactor += 10;
      }
    });
  }

  // 5. Total Estimated Minutes
  const totalEstimatedMinutes = travelMinutes + estimatedIntakeMinutes + resourceAvailabilityFactor + specialistAvailabilityFactor;

  // Confidence based on data freshness and network status
  let confidence: ForecastConfidence = hospital.dataConfidence;
  
  // Create Explanation
  let explanation = '';
  if (totalEstimatedMinutes < travelMinutes + 15) {
    explanation = `CARE ROUTE estimates fast intake and strong resource availability, creating a rapid path to care.`;
  } else if (resourceAvailabilityFactor > 0 || specialistAvailabilityFactor > 0) {
    explanation = `Travel time is ${travelMinutes} min, but limited resource/specialist availability adds estimated delays.`;
  } else if (estimatedIntakeMinutes >= 18) {
    explanation = `High hospital capacity pressure increases the expected intake delay.`;
  } else {
    explanation = `Expected total time includes travel and standard intake procedures.`;
  }

  return {
    travelMinutes,
    estimatedIntakeMinutes,
    resourceAvailabilityFactor,
    specialistAvailabilityFactor,
    totalEstimatedMinutes,
    confidence,
    explanation
  };
}
