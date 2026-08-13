import { User } from '@/types/auth';

export const DEMO_PERSONAS: Record<string, User> = {
  PATIENT: {
    id: 'patient-123',
    email: 'patient@demo.careroute.com',
    name: 'Demo Patient',
    // Role is explicitly undefined for PATIENT to simulate a standard end-user
  },
  REFERRER: {
    id: 'referrer-456',
    email: 'referrer@demo.careroute.com',
    name: 'Demo Referrer',
    role: 'REFERRER',
    organization: 'Demo Medical Center',
    specialization: 'Cardiology',
    status: 'ACTIVE'
  },
  HOSPITAL_STAFF: {
    id: 'staff-789',
    email: 'staff@citycare.demo',
    name: 'Demo Hospital Staff',
    role: 'HOSPITAL_STAFF',
    organization: 'CityCare',
    status: 'ACTIVE'
  },
  ADMIN: {
    id: 'admin-000',
    email: 'admin@careroute.system',
    name: 'Demo Administrator',
    role: 'ADMIN',
    status: 'ACTIVE'
  }
};
