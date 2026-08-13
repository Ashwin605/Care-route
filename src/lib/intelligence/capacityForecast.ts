// ============================================================
// CARE ROUTE — Capacity Forecast
// ============================================================

import { CapacityMetric } from '../../types/hospital';
import { CapacityTrajectoryPoint, HospitalLoadIntelligence, CapacityPressure } from '../../types/intelligence';

export interface CapacityForecastResult {
  currentAvailable: number;
  expectedAvailable: number;
}

export function forecastCapacity(
  currentCapacity: CapacityMetric,
  etaMinutes: number
): CapacityForecastResult {
  const currentAvailable = currentCapacity.available;
  
  // Very simplistic simulation:
  // Assume a slight chance of capacity dropping by 1 if ETA > 15 mins
  // In a real system, this would use ML models based on historical flux and incoming ambulances
  let expectedAvailable = currentAvailable;
  
  if (etaMinutes > 15 && currentAvailable > 0) {
    // 30% chance a bed might be taken (deterministic pseudo-random)
    const factor = ((currentAvailable * 17) % 10) / 10;
    if (factor > 0.7) {
      expectedAvailable -= 1;
    }
  }

  return {
    currentAvailable,
    expectedAvailable: Math.max(0, expectedAvailable), // Don't go below 0
  };
}

export function generateCapacityTrajectory(
  currentCapacity: CapacityMetric,
  etaMinutes: number
): CapacityTrajectoryPoint[] {
  const trajectory: CapacityTrajectoryPoint[] = [];
  let currentAvail = currentCapacity.available;
  
  trajectory.push({
    timeLabel: 'NOW',
    expectedAvailable: currentAvail,
    trend: 'STABLE'
  });

  const timeSteps = [15, 30, 45, 60];
  let previousAvail = currentAvail;
  let pseudoRandomSeed = currentCapacity.total + currentCapacity.available;

  for (const step of timeSteps) {
    if (step >= etaMinutes) break; // Don't predict generic steps past ETA

    pseudoRandomSeed = (pseudoRandomSeed * 31) % 100;
    const rand = pseudoRandomSeed / 100;

    // Dummy logic: each 15 mins has a chance to consume a bed if available
    // In a real hackathon demo, we make it predictable for a nice graph
    if (previousAvail > 0 && rand > 0.6) {
      previousAvail -= 1;
    }
    
    trajectory.push({
      timeLabel: `+${step}m`,
      expectedAvailable: previousAvail,
      trend: previousAvail < currentAvail ? 'DECLINING' : 'STABLE'
    });
  }

  // Add the final ETA point
  const finalForecast = forecastCapacity({ ...currentCapacity, available: currentAvail }, etaMinutes);
  // Force it to match the last simulated step to prevent graph jumping
  const finalExpected = Math.min(previousAvail, finalForecast.expectedAvailable);

  trajectory.push({
    timeLabel: `ARRIVAL (+${etaMinutes}m)`,
    expectedAvailable: finalExpected,
    trend: finalExpected < currentAvail ? 'DECLINING' : 'STABLE'
  });

  return trajectory;
}

export function analyzeHospitalLoad(
  hospitalId: string,
  currentCapacity: CapacityMetric,
  etaMinutes: number,
  overrideDelta: number = 0
): HospitalLoadIntelligence {
  const currentAvail = currentCapacity.available; // This already includes the overrideDelta if applied beforehand, but let's assume it doesn't in some calls or it does. In our flow, currentCapacity has overrides applied before calling this.

  // 1. Generate Deterministic Historical Data
  // We use the hospitalId and resource name to make it deterministic.
  const hash = (hospitalId + currentCapacity.name).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  // Base historical trend: if current is low, it was likely higher before. 
  // If current is high, it was likely stable.
  const isDeclining = hash % 2 === 0;
  
  const historicalData: CapacityTrajectoryPoint[] = [];
  let pastAvail = currentAvail;
  
  const historicalSteps = [15, 30, 45, 60];
  let pastSeed = hash;

  for (const step of historicalSteps) {
    pastSeed = (pastSeed * 17) % 100;
    
    if (isDeclining) {
      pastAvail += Math.floor((pastSeed / 100) * 2) + 1; // +1 or +2 per 15 min
    } else {
      // Stable means tiny fluctuations
      pastAvail += ((pastSeed / 100) > 0.5 ? 1 : 0);
    }
    
    historicalData.unshift({
      timeLabel: `-${step}m`,
      expectedAvailable: pastAvail,
      trend: (isDeclining ? 'DECLINING' : 'STABLE') as 'DECLINING' | 'STABLE',
      isHistorical: true
    });
  }

  // 2. Add NOW point to historical
  historicalData.push({
    timeLabel: 'NOW',
    expectedAvailable: currentAvail,
    trend: (isDeclining ? 'DECLINING' : 'STABLE') as 'DECLINING' | 'STABLE',
    isHistorical: true
  });

  // 3. Generate Forecast
  // Use the existing logic to generate future points, removing the first 'NOW' point
  const fullForecast = generateCapacityTrajectory(currentCapacity, etaMinutes);
  const forecastData = fullForecast.filter(p => p.timeLabel !== 'NOW');

  // 4. Calculate Pressure & Trend Description
  const percentAvailable = currentAvail / Math.max(1, currentCapacity.total);
  
  let pressure: CapacityPressure = 'LOW';
  if (percentAvailable < 0.1 || currentAvail === 0) pressure = 'CRITICAL';
  else if (percentAvailable < 0.25) pressure = 'HIGH';
  else if (percentAvailable < 0.5) pressure = 'MODERATE';

  // If What-If lowered capacity, it's tightening
  const isTightening = isDeclining || overrideDelta < 0 || pressure === 'CRITICAL' || pressure === 'HIGH';

  let trendDescription = 'Capacity stable';
  if (isTightening) trendDescription = 'Capacity tightening';
  if (pressure === 'CRITICAL') trendDescription = 'Severe capacity pressure';
  
  return {
    pressure,
    trendDescription,
    historicalData,
    forecastData
  };
}
