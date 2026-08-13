// ============================================================
// CARE ROUTE — Authentication Types
// ============================================================

export type Role = 'REFERRER' | 'HOSPITAL_STAFF' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name: string;
  role?: Role; // Role might be undefined right after registration before selection
  organization?: string;
  phone?: string;
  specialization?: string;
  status?: 'ACTIVE' | 'PENDING' | 'INACTIVE';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
