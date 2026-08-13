import { User, Role } from '@/types/auth';

// ============================================================
// CARE ROUTE — Mocked Authentication Service
// ============================================================
// This layer abstracts the authentication implementation.
// For the prototype, it simulates network delays and returns mock data.
// In production, replace these with fetch calls to the backend API.

const DELAY = 800; // Simulated network delay

export const mockLogin = async (email: string, password?: string): Promise<User> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === 'error@example.com') {
        reject(new Error('Invalid email or password.'));
      } else {
        // Return a mock user
        resolve({
          id: 'usr_mock123',
          email,
          name: 'Dr. Sarah Chen',
          // Simulate a user who hasn't selected a role yet if they just signed up,
          // but for login, we'll pretend they don't have a role yet to force them through selection for the demo.
          // In a real app, you'd return their actual role.
        });
      }
    }, DELAY);
  });
};

export const mockRegister = async (userData: Partial<User>): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'usr_new456',
        email: userData.email || 'demo@example.com',
        name: userData.name || 'Demo User',
        role: userData.role,
        organization: userData.organization,
      });
    }, DELAY);
  });
};

export const mockUpdateRole = async (userId: string, role: Role): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: userId,
        email: 'demo@example.com',
        name: 'Demo User',
        role,
      });
    }, 500);
  });
};
