import { HospitalProfile, CapacityMetric } from '../../types/hospital';
import { UrgencyLevel } from '../../types/care';

/**
 * Deterministically estimates intake time based on hospital status and capacity.
 * Note: These are simulated operational values for the prototype, not clinically validated.
 */
export function estimateIntakeTime(
  hospital: HospitalProfile,
  capacity: CapacityMetric[],
  urgency: UrgencyLevel | null
): number {
  let baseIntake = 10; // Default stable capacity

  // Check emergency status if applicable
  if (urgency === 'CRITICAL' || urgency === 'URGENT') {
    if (hospital.emergencyStatus === 'OPERATIONAL' || hospital.networkStatus === 'OPERATIONAL') {
      baseIntake = 8;
    } else if (hospital.emergencyStatus === 'DEGRADED' || hospital.networkStatus === 'DEGRADED') {
      baseIntake = 18;
    } else {
      baseIntake = 20;
    }
  }

  // Determine if there is high capacity pressure
  // (e.g., ICU is heavily occupied or general beds are mostly full)
  let highPressure = false;
  let totalBeds = 0;
  let totalOccupied = 0;
  
  for (const cap of capacity) {
    if (cap.total > 0) {
      totalBeds += cap.total;
      totalOccupied += cap.occupied;
    }
  }

  if (totalBeds > 0) {
    const occupancyRate = totalOccupied / totalBeds;
    if (occupancyRate > 0.85) {
      highPressure = true;
    }
  }

  if (highPressure) {
    baseIntake = Math.max(baseIntake, 25);
  }

  return baseIntake;
}
