'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { HospitalState, DetailedReferral, CapacityMetric, ResourceStatus, SpecialistMetric } from '@/types/hospital';
import { MOCK_HOSPITALS } from '@/data/mockHospitals';
import { MOCK_CAPACITY } from '@/data/mockHospitalCapacity';
import { MOCK_SPECIALISTS } from '@/data/mockSpecialists';

const initialHospitalState: HospitalState = {
  profile: MOCK_HOSPITALS[0],
  capacity: MOCK_CAPACITY[MOCK_HOSPITALS[0].id] || [],
  specialists: MOCK_SPECIALISTS[MOCK_HOSPITALS[0].id] || [],
  incomingReferrals: [
    {
      id: 'REF-2048',
      patientId: 'CR-1042',
      age: 62,
      urgency: 'CRITICAL',
      specialty: 'Cardiology',
      condition: 'Cardiac emergency',
      requiredResources: ['ICU', 'Cardiology', 'Ventilator', 'Emergency', 'Cardiac Cath Lab'],
      patientETA: 18,
      distance: 7.8,
      receivedAt: new Date(Date.now() - 2 * 60000).toISOString(), // 2 mins ago
      status: 'AWAITING_RESPONSE',
    },
    {
      id: 'REF-2047',
      patientId: 'CR-1099',
      age: 45,
      urgency: 'URGENT',
      specialty: 'Neurology',
      condition: 'Neurological assessment',
      requiredResources: ['Neurology', 'Emergency', 'Imaging'],
      patientETA: 26,
      distance: 12.4,
      receivedAt: new Date(Date.now() - 5 * 60000).toISOString(), // 5 mins ago
      status: 'AWAITING_RESPONSE',
    }
  ],
  referralHistory: [
    {
      id: 'REF-2045',
      patientId: 'CR-0988',
      age: 34,
      urgency: 'STANDARD',
      specialty: 'Orthopedics',
      condition: 'Fracture management',
      requiredResources: ['Orthopedics', 'Imaging'],
      patientETA: 45,
      distance: 15.2,
      receivedAt: new Date(Date.now() - 120 * 60000).toISOString(),
      status: 'ACCEPTED',
    },
    {
      id: 'REF-2044',
      patientId: 'CR-0912',
      age: 71,
      urgency: 'CRITICAL',
      specialty: 'Pulmonology',
      condition: 'Severe respiratory distress',
      requiredResources: ['ICU', 'Ventilator'],
      patientETA: 15,
      distance: 5.1,
      receivedAt: new Date(Date.now() - 180 * 60000).toISOString(),
      status: 'DECLINED',
      declineReason: 'ICU capacity unavailable',
    }
  ]
};

interface HospitalContextType extends HospitalState {
  acceptReferral: (id: string) => void;
  declineReferral: (id: string, reason: string) => void;
  updateCapacity: (id: string, updates: Partial<CapacityMetric>) => void;
  updateSpecialist: (id: string, updates: Partial<SpecialistMetric>) => void;
  refreshData: () => void; // simulates polling
}

const HospitalContext = createContext<HospitalContextType | undefined>(undefined);

export function HospitalProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<HospitalState>(initialHospitalState);

  // Load from local storage if available for persistence during demo
  useEffect(() => {
    const stored = localStorage.getItem('care_route_hospital_state');
    if (stored) {
      try {
        setState(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    localStorage.setItem('care_route_hospital_state', JSON.stringify(state));
  }, [state]);

  const acceptReferral = (id: string) => {
    setState(prev => {
      const referralIndex = prev.incomingReferrals.findIndex(r => r.id === id);
      if (referralIndex === -1) return prev;

      const referral = prev.incomingReferrals[referralIndex];
      const updatedReferral: DetailedReferral = {
        ...referral,
        status: 'ACCEPTED',
      };

      return {
        ...prev,
        incomingReferrals: prev.incomingReferrals.filter(r => r.id !== id),
        referralHistory: [updatedReferral, ...prev.referralHistory],
      };
    });
  };

  const declineReferral = (id: string, reason: string) => {
    setState(prev => {
      const referralIndex = prev.incomingReferrals.findIndex(r => r.id === id);
      if (referralIndex === -1) return prev;

      const referral = prev.incomingReferrals[referralIndex];
      const updatedReferral: DetailedReferral = {
        ...referral,
        status: 'DECLINED',
        declineReason: reason,
      };

      return {
        ...prev,
        incomingReferrals: prev.incomingReferrals.filter(r => r.id !== id),
        referralHistory: [updatedReferral, ...prev.referralHistory],
      };
    });
  };

  const updateCapacity = (id: string, updates: Partial<CapacityMetric>) => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        lastUpdate: new Date().toISOString(),
      },
      capacity: prev.capacity.map(c => c.id === id ? { ...c, ...updates, available: updates.total !== undefined && updates.occupied !== undefined ? updates.total - updates.occupied : (updates.available !== undefined ? updates.available : c.available) } : c)
    }));
  };

  const updateSpecialist = (id: string, updates: Partial<SpecialistMetric>) => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        lastUpdate: new Date().toISOString(),
      },
      specialists: prev.specialists.map(s => s.id === id ? { ...s, ...updates } : s)
    }));
  };

  const refreshData = () => {
    setState(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        lastUpdate: new Date().toISOString(),
      }
    }));
  };

  return (
    <HospitalContext.Provider value={{ ...state, acceptReferral, declineReferral, updateCapacity, updateSpecialist, refreshData }}>
      {children}
    </HospitalContext.Provider>
  );
}

export function useHospital() {
  const context = useContext(HospitalContext);
  if (context === undefined) {
    throw new Error('useHospital must be used within a HospitalProvider');
  }
  return context;
}
