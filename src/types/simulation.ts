import { IntelligenceResult, WhatIfOverrides } from './intelligence';

export type SimulationChangeType = 
  | 'HOSPITAL_STATUS'
  | 'CAPACITY_DELTA'
  | 'RESOURCE_STATUS'
  | 'SPECIALIST_STATUS'
  | 'TRAFFIC_MULTIPLIER';

export interface SimulationChange {
  id: string;
  hospitalId: string;
  hospitalName: string;
  type: SimulationChangeType;
  targetId?: string; // e.g., 'icu', 'cardiology'
  targetName?: string;
  previousValue: string;
  simulatedValue: string;
}

export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  createdBy: string;
  changes: SimulationChange[];
}

export interface SimulationResult {
  scenario: SimulationScenario;
  baseline: IntelligenceResult;
  simulated: IntelligenceResult;
  executedAt: string;
}
