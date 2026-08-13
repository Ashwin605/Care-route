import { HospitalProfile, CapacityMetric, SpecialistMetric } from '../../types/hospital';
import { CareRequirement } from '../../types/care';
import { WhatIfOverrides } from '../../types/intelligence';
import { SimulationScenario, SimulationResult } from '../../types/simulation';
import { analyzeHealthcareNetwork } from '../intelligence/networkAnalyzer';

export function runSimulation(
  hospitals: HospitalProfile[],
  capacity: Record<string, CapacityMetric[]>,
  specialists: Record<string, SpecialistMetric[]>,
  requirement: CareRequirement,
  scenario: SimulationScenario
): SimulationResult {
  
  // 1. Establish Baseline (Zero overrides)
  // Deep clone input arrays just in case, guaranteeing zero side-effects.
  const baseHospitals = JSON.parse(JSON.stringify(hospitals));
  const baseCapacity = JSON.parse(JSON.stringify(capacity));
  const baseSpecialists = JSON.parse(JSON.stringify(specialists));

  const baselineResult = analyzeHealthcareNetwork(
    baseHospitals,
    baseCapacity,
    baseSpecialists,
    requirement
  );

  // 2. Translate Scenario into Overrides
  const overrides: WhatIfOverrides = {
    disabledHospitals: [],
    capacityDeltas: {},
    specialistUnavailability: []
  };

  scenario.changes.forEach(change => {
    if (change.type === 'HOSPITAL_STATUS' && change.simulatedValue === 'UNAVAILABLE') {
      if (!overrides.disabledHospitals) overrides.disabledHospitals = [];
      overrides.disabledHospitals.push(change.hospitalId);
    }
    
    if (change.type === 'CAPACITY_DELTA' && change.targetName) {
      if (!overrides.capacityDeltas) overrides.capacityDeltas = {};
      if (!overrides.capacityDeltas[change.hospitalId]) overrides.capacityDeltas[change.hospitalId] = {};
      
      const delta = parseInt(change.simulatedValue) - parseInt(change.previousValue);
      overrides.capacityDeltas[change.hospitalId][change.targetName] = delta;
    }

    if (change.type === 'SPECIALIST_STATUS' && change.simulatedValue === 'UNAVAILABLE' && change.targetName) {
      if (!overrides.specialistUnavailability) overrides.specialistUnavailability = [];
      overrides.specialistUnavailability.push(change.targetName);
    }

    if (change.type === 'TRAFFIC_MULTIPLIER') {
      overrides.trafficMultiplier = parseFloat(change.simulatedValue);
    }
  });

  // 3. Execute Simulated Run
  const simulatedResult = analyzeHealthcareNetwork(
    baseHospitals,
    baseCapacity,
    baseSpecialists,
    requirement,
    overrides
  );

  // 4. Return safely contained result
  return {
    scenario,
    baseline: baselineResult,
    simulated: simulatedResult,
    executedAt: new Date().toISOString()
  };
}
