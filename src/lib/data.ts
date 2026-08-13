// ============================================================
// CARE ROUTE — Simulated Prototype Data
// ============================================================
// All data is clearly marked as simulated.
// This will be replaced by real API calls when the backend is connected.

import type {
  Hospital,
  HowItWorksStep,
  ReferralTimelineEvent,
  ReferralRequest,
  ConceptFlowStep,
  NavigationLink,
} from './types';

// ─── Navigation ──────────────────────────────────────────────

export const navigationLinks: NavigationLink[] = [
  { label: 'How it works', href: '/#how-it-works' },
  { label: 'For Hospitals', href: '/login' },
  { label: 'For Referrers', href: '/care' },
  { label: 'About', href: '/about' },
];

// ─── Problem Section — Hospital Comparison ───────────────────

export const problemHospitals: {
  name: string;
  distance: string;
  issues: string[];
  capabilities: { name: string; available: boolean }[];
  recommended: boolean;
}[] = [
  {
    name: 'Hospital A',
    distance: '2.4 km',
    issues: ['ICU unavailable'],
    capabilities: [
      { name: 'ICU', available: false },
      { name: 'Specialist', available: true },
      { name: 'Ventilator', available: true },
      { name: 'Emergency', available: true },
    ],
    recommended: false,
  },
  {
    name: 'Hospital B',
    distance: '5.1 km',
    issues: ['Specialist unavailable'],
    capabilities: [
      { name: 'ICU', available: true },
      { name: 'Specialist', available: false },
      { name: 'Ventilator', available: true },
      { name: 'Emergency', available: true },
    ],
    recommended: false,
  },
  {
    name: 'Hospital C',
    distance: '7.8 km',
    issues: [],
    capabilities: [
      { name: 'ICU', available: true },
      { name: 'Specialist', available: true },
      { name: 'Ventilator', available: true },
      { name: 'Emergency', available: true },
    ],
    recommended: true,
  },
];

// ─── Concept Flow ────────────────────────────────────────────

export const conceptFlowSteps: ConceptFlowStep[] = [
  { label: 'Patient', description: 'Incoming referral request' },
  { label: 'Requirements', description: 'Analyze clinical needs' },
  { label: 'Eligibility', description: 'Filter capable hospitals' },
  { label: 'Capacity Forecast', description: 'Predict future availability' },
  { label: 'Arrival-Time Match', description: 'Coordinate with ETA' },
  { label: 'Hospital Confirmation', description: 'Secure bed commitment' },
  { label: 'Referral', description: 'Coordinate transfer' },
];

// ─── How It Works Steps ──────────────────────────────────────

export const howItWorksSteps: HowItWorksStep[] = [
  {
    number: '01',
    title: 'Understand the patient',
    description:
      'Capture the patient\'s condition, severity, and clinical requirements to build a precise needs profile.',
  },
  {
    number: '02',
    title: 'Filter unsuitable hospitals',
    description:
      'Immediately exclude hospitals lacking the required specialties, equipment, or departments.',
  },
  {
    number: '03',
    title: 'Predict capacity',
    description:
      'Forecast bed and resource availability at the estimated time of arrival, not just current status.',
  },
  {
    number: '04',
    title: 'Rank suitable hospitals',
    description:
      'Score remaining hospitals by capability match, predicted capacity, travel time, and historical outcomes.',
  },
  {
    number: '05',
    title: 'Request hospital confirmation',
    description:
      'Send a structured referral request to the top-ranked hospital and await confirmation before patient transfer.',
  },
  {
    number: '06',
    title: 'Track the referral',
    description:
      'Monitor the entire referral journey from creation through admission with real-time status updates.',
  },
];

// ─── Intelligent Matching — Recommended Hospital ─────────────

export const recommendedHospital: Hospital = {
  id: 'h-citycare-001',
  name: 'CityCare Hospital',
  distance: 7.8,
  eta: 18,
  suitabilityScore: 91,
  status: 'available',
  lastUpdated: 42,
  capabilities: [
    { name: 'Cardiologist available', available: true, category: 'specialist' },
    { name: 'ICU available', available: true, category: 'department' },
    { name: 'Ventilator available', available: true, category: 'equipment' },
    { name: 'Emergency active', available: true, category: 'service' },
    { name: 'Capacity predicted available at ETA', available: true, category: 'service' },
  ],
  capacity: [
    { label: 'Now', timeOffset: 0, beds: 2, trend: 'stable' },
    { label: '+30 min', timeOffset: 30, beds: 2, trend: 'stable' },
    { label: '+60 min', timeOffset: 60, beds: 1, trend: 'declining' },
    { label: '+90 min', timeOffset: 90, beds: 0, trend: 'declining' },
  ],
};

// ─── Capacity Handshake — Referral Request ───────────────────

export const sampleReferralRequest: ReferralRequest = {
  condition: 'Critical cardiac emergency',
  severity: 'critical',
  requirements: ['ICU', 'Cardiology', 'Ventilator', 'Emergency'],
  eta: 18,
  hospital: {
    name: 'CityCare Hospital',
  },
};

// ─── Referral Journey Timeline ───────────────────────────────

export const referralTimeline: ReferralTimelineEvent[] = [
  { status: 'created', label: 'Created', completed: true, active: false },
  { status: 'requirements_analyzed', label: 'Requirements analyzed', completed: true, active: false },
  { status: 'hospital_matched', label: 'Hospital matched', completed: true, active: false },
  { status: 'referral_sent', label: 'Referral sent', completed: true, active: false },
  { status: 'hospital_accepted', label: 'Hospital accepted', completed: true, active: false },
  { status: 'patient_en_route', label: 'Patient en route', completed: false, active: true },
  { status: 'arrived', label: 'Arrived', completed: false, active: false },
  { status: 'admitted', label: 'Admitted', completed: false, active: false },
];

// ─── Trust Indicators ────────────────────────────────────────

export const trustIndicators = [
  'Capacity-aware',
  'AI-assisted',
  'Professional decision support',
] as const;
