import { Referral, ReferralActivity } from '../types/referral';
import { MOCK_HOSPITALS } from './mockHospitals';

export const MOCK_REFERRALS: Referral[] = [
  {
    id: 'REF-1001',
    patientReference: 'PT-8429',
    referrerId: 'user-1',
    destinationHospitalId: MOCK_HOSPITALS[0].id,
    destinationHospitalName: MOCK_HOSPITALS[0].name,
    careRequirement: {
      careType: 'EMERGENCY',
      urgency: 'CRITICAL',
      resources: ['ICU_BED', 'VENTILATOR'],
      specialists: ['CARDIOLOGIST'],
      radiusKm: 50,
      location: { lat: 13.6288, lng: 79.4192 },
      accessibilityNeeds: []
    },
    status: 'ACCEPTED',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 1800000).toISOString(),
    journeyId: 'journey-123',
  },
  {
    id: 'REF-1002',
    patientReference: 'PT-9102',
    referrerId: 'user-1',
    destinationHospitalId: MOCK_HOSPITALS[1].id,
    destinationHospitalName: MOCK_HOSPITALS[1].name,
    careRequirement: {
      resources: ['BURN_BED'],
      specialists: [],
      maxDistance: 25,
      location: { lat: 13.5501, lng: 79.3512, address: 'Tirupati North' }
    },
    status: 'PENDING',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'REF-1003',
    patientReference: 'PT-3341',
    referrerId: 'user-1',
    destinationHospitalId: MOCK_HOSPITALS[2].id,
    destinationHospitalName: MOCK_HOSPITALS[2].name,
    careRequirement: {
      careType: 'SPECIALIST',
      urgency: 'URGENT',
      resources: [],
      specialists: ['NEUROLOGIST'],
      radiusKm: 100,
      location: { lat: 13.4802, lng: 79.2905 },
      accessibilityNeeds: []
    },
    status: 'UNDER_REVIEW',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 80000000).toISOString(),
  },
  {
    id: 'REF-1004',
    patientReference: 'PT-1198',
    referrerId: 'user-1',
    destinationHospitalId: MOCK_HOSPITALS[0].id,
    destinationHospitalName: MOCK_HOSPITALS[0].name,
    careRequirement: {
      careType: 'GENERAL',
      urgency: 'ROUTINE',
      resources: ['NICU_BED'],
      specialists: [],
      radiusKm: 30,
      location: { lat: 13.6105, lng: 79.3801 },
      accessibilityNeeds: []
    },
    status: 'DECLINED',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    updatedAt: new Date(Date.now() - 170000000).toISOString(),
    notes: 'Hospital at capacity. Please reroute.',
  }
];

export const MOCK_REFERRAL_ACTIVITY: ReferralActivity[] = [
  {
    id: 'act-1',
    referralId: 'REF-1001',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    type: 'JOURNEY_STARTED',
    description: 'Patient en route to CityCare Medical Center'
  },
  {
    id: 'act-2',
    referralId: 'REF-1001',
    timestamp: new Date(Date.now() - 1900000).toISOString(),
    type: 'ACCEPTED',
    description: 'Referral accepted by CityCare Medical Center'
  },
  {
    id: 'act-3',
    referralId: 'REF-1003',
    timestamp: new Date(Date.now() - 80000000).toISOString(),
    type: 'RECEIVED',
    description: 'Referral under review by Regional Health'
  },
  {
    id: 'act-4',
    referralId: 'REF-1004',
    timestamp: new Date(Date.now() - 170000000).toISOString(),
    type: 'DECLINED',
    description: 'Referral declined by CityCare Medical Center'
  }
];
