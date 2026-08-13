"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { MOCK_REFERRALS, MOCK_REFERRAL_ACTIVITY } from '@/data/mockReferrals';
import { MOCK_CAPACITY } from '@/data/mockHospitalCapacity';
import { MOCK_NETWORK_EVENTS } from '@/data/mockEvents';
import { MOCK_HOSPITALS } from '@/data/mockHospitals';
import { Referral, ReferralActivity } from '@/types/referral';
import { CapacityMetric, NetworkEvent, HospitalProfile } from '@/types/intelligence';
import { transitionReferral } from '@/lib/referrals/lifecycleEngine';

interface NetworkStateContextType {
  hospitals: HospitalProfile[];
  referrals: Referral[];
  activities: ReferralActivity[];
  capacity: Record<string, CapacityMetric[]>;
  networkEvents: NetworkEvent[];
  
  // Actions
  acceptReferral: (referralId: string, actorId: string, actorRole: 'REFERRER' | 'HOSPITAL_STAFF' | 'SYSTEM', hospitalName: string) => void;
  declineReferral: (referralId: string, actorId: string, actorRole: 'REFERRER' | 'HOSPITAL_STAFF' | 'SYSTEM', hospitalName: string, reason: string) => void;
  addReferral: (referral: Referral) => void;
  updateCapacity: (hospitalId: string, resourceType: string, newAvailable: number) => void;
  resetDemoState: () => void;
}

const NetworkStateContext = createContext<NetworkStateContextType | undefined>(undefined);

export function NetworkStateProvider({ children }: { children: ReactNode }) {
  // Initialize from seed data
  const [hospitals, setHospitals] = useState<HospitalProfile[]>(MOCK_HOSPITALS);
  const [referrals, setReferrals] = useState<Referral[]>(MOCK_REFERRALS);
  const [activities, setActivities] = useState<ReferralActivity[]>(MOCK_REFERRAL_ACTIVITY);
  const [capacity, setCapacity] = useState<Record<string, CapacityMetric[]>>(MOCK_CAPACITY);
  const [networkEvents, setNetworkEvents] = useState<NetworkEvent[]>(MOCK_NETWORK_EVENTS);

  const acceptReferral = (referralId: string, actorId: string, actorRole: 'REFERRER' | 'HOSPITAL_STAFF' | 'SYSTEM', hospitalName: string) => {
    setReferrals(prev => {
      const target = prev.find(r => r.id === referralId);
      if (!target) return prev;
      
      const { updatedReferral, auditEvent } = transitionReferral(
        target,
        'ACCEPTED',
        actorId,
        actorRole,
        `Referral accepted by ${hospitalName}`
      );

      // Update activities reactively
      setActivities(prevAct => [auditEvent, ...prevAct]);

      // Fire network event
      const newEvent: NetworkEvent = {
        id: `evt-${Date.now()}`,
        type: 'REFERRAL_ACCEPTED',
        hospitalId: updatedReferral.destinationHospitalId,
        hospitalName: updatedReferral.destinationHospitalName,
        severity: 'INFO',
        timestamp: new Date().toISOString()
      };
      setNetworkEvents(prevEvt => [newEvent, ...prevEvt]);

      // Return updated referrals array
      return prev.map(r => r.id === referralId ? updatedReferral : r);
    });
  };

  const declineReferral = (referralId: string, actorId: string, actorRole: 'REFERRER' | 'HOSPITAL_STAFF' | 'SYSTEM', hospitalName: string, reason: string) => {
    setReferrals(prev => {
      const target = prev.find(r => r.id === referralId);
      if (!target) return prev;
      
      const { updatedReferral, auditEvent } = transitionReferral(
        target,
        'DECLINED',
        actorId,
        actorRole,
        `Referral declined by ${hospitalName}. Reason: ${reason}`
      );

      // Update activities reactively
      setActivities(prevAct => [auditEvent, ...prevAct]);

      // Fire network event
      const newEvent: NetworkEvent = {
        id: `evt-${Date.now()}`,
        type: 'HOSPITAL_STATUS_CHANGED', // Closest match, or we could add REFERRAL_DECLINED
        hospitalId: updatedReferral.destinationHospitalId,
        hospitalName: updatedReferral.destinationHospitalName,
        severity: 'WARNING',
        timestamp: new Date().toISOString(),
        newState: 'Declined Referral'
      };
      setNetworkEvents(prevEvt => [newEvent, ...prevEvt]);

      // Return updated referrals array
      return prev.map(r => r.id === referralId ? updatedReferral : r);
    });
  };

  const addReferral = (referral: Referral) => {
    setReferrals(prev => [referral, ...prev]);
  };

  const updateCapacity = (hospitalId: string, resourceType: string, newAvailable: number) => {
    setCapacity(prev => {
      const hospitalCaps = prev[hospitalId] || [];
      const updatedCaps = hospitalCaps.map(c => 
        c.type === resourceType ? { ...c, available: newAvailable, lastUpdated: new Date().toISOString() } : c
      );
      
      // Fire network event
      const newEvent: NetworkEvent = {
        id: `evt-${Date.now()}`,
        type: 'CAPACITY_CHANGED',
        hospitalId,
        hospitalName: hospitals.find(h => h.id === hospitalId)?.name || 'Unknown',
        severity: newAvailable === 0 ? 'CRITICAL' : 'INFO',
        timestamp: new Date().toISOString(),
      };
      setNetworkEvents(prevEvt => [newEvent, ...prevEvt]);

      return {
        ...prev,
        [hospitalId]: updatedCaps
      };
    });
  };

  const resetDemoState = () => {
    setHospitals(MOCK_HOSPITALS);
    setReferrals(MOCK_REFERRALS);
    setActivities(MOCK_REFERRAL_ACTIVITY);
    setCapacity(MOCK_CAPACITY);
    setNetworkEvents(MOCK_NETWORK_EVENTS);
    
    // Clear local storage demo state
    localStorage.removeItem('careRequirements');
    localStorage.removeItem('active_care_journey');
  };

  return (
    <NetworkStateContext.Provider value={{
      hospitals,
      referrals,
      activities,
      capacity,
      networkEvents,
      acceptReferral,
      declineReferral,
      addReferral,
      updateCapacity,
      resetDemoState
    }}>
      {children}
    </NetworkStateContext.Provider>
  );
}

export function useNetworkState() {
  const context = useContext(NetworkStateContext);
  if (context === undefined) {
    throw new Error('useNetworkState must be used within a NetworkStateProvider');
  }
  return context;
}
