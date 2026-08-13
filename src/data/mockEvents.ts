export type EventType = 
  | 'HOSPITAL_STATUS_CHANGED'
  | 'CAPACITY_CHANGED'
  | 'RESOURCE_STATUS_CHANGED'
  | 'SPECIALIST_STATUS_CHANGED'
  | 'DATA_BECAME_STALE'
  | 'RESOURCE_BECAME_UNAVAILABLE';

import { processNetworkEventForJourneys } from '../lib/intelligence/networkEventProcessor';

export type EventSeverity = 'INFO' | 'WARNING' | 'CRITICAL';

export interface NetworkEvent {
  id: string;
  type: EventType;
  hospitalId: string;
  hospitalName: string;
  resourceId?: string;
  specialistId?: string;
  previousState?: string;
  newState?: string;
  timestamp: string;
  severity: EventSeverity;
  source: string;
}

// ---------------------------------------------------------
// CENTRALIZED SEVERITY ENGINE
// ---------------------------------------------------------
export function calculateEventSeverity(
  type: EventType, 
  previousState?: string, 
  newState?: string, 
  value?: number
): EventSeverity {
  
  if (type === 'HOSPITAL_STATUS_CHANGED') {
    if (newState === 'UNAVAILABLE') return 'CRITICAL';
    if (newState === 'LIMITED' || newState === 'AT_RISK') return 'WARNING';
    return 'INFO';
  }

  if (type === 'CAPACITY_CHANGED') {
    // If a capacity value hits 0, it's critical
    if (newState === '0') return 'CRITICAL';
    if (previousState && newState && parseInt(newState) < parseInt(previousState)) return 'WARNING';
    return 'INFO';
  }

  if (type === 'RESOURCE_STATUS_CHANGED' || type === 'SPECIALIST_STATUS_CHANGED' || type === 'RESOURCE_BECAME_UNAVAILABLE') {
    if (newState === 'UNAVAILABLE') return 'CRITICAL';
    if (newState === 'LIMITED') return 'WARNING';
    return 'INFO';
  }

  if (type === 'DATA_BECAME_STALE') {
    return 'WARNING';
  }

  return 'INFO';
}

// ---------------------------------------------------------
// IN-MEMORY EVENT STORE
// ---------------------------------------------------------
export const MOCK_NETWORK_EVENTS: NetworkEvent[] = [
  {
    id: 'evt-initial-1',
    type: 'HOSPITAL_STATUS_CHANGED',
    hospitalId: 'h-metrocare-002',
    hospitalName: 'MetroCare Medical',
    previousState: 'OPERATIONAL',
    newState: 'LIMITED',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    severity: 'WARNING',
    source: 'System'
  }
];

export function publishNetworkEvent(
  params: Omit<NetworkEvent, 'id' | 'timestamp' | 'severity'> & { overrideSeverity?: EventSeverity }
) {
  const severity = params.overrideSeverity || calculateEventSeverity(params.type, params.previousState, params.newState);
  
  const newEvent: NetworkEvent = {
    ...params,
    id: `evt-${Date.now()}-${Math.floor(Math.random()*1000)}`,
    timestamp: new Date().toISOString(),
    severity
  };

  MOCK_NETWORK_EVENTS.unshift(newEvent);
  
  // Connect Phase 3 Network Events to Phase 5 Active Journeys
  if (typeof window !== 'undefined') {
    // We wrap in timeout to ensure state is settled before processing
    setTimeout(() => {
      processNetworkEventForJourneys(newEvent);
    }, 0);
  }

  return newEvent;
}
