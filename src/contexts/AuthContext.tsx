'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Role, AuthState } from '@/types/auth';
import { mockLogin, mockRegister, mockUpdateRole } from '@/lib/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password?: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateRole: (role: Role) => Promise<void>;
  loginAsDemoPersona: (persona: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Initially true while we check for stored session
    error: null,
  });

  useEffect(() => {
    // Check for stored mock session on mount
    const storedUser = localStorage.getItem('care_route_mock_user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } catch (e) {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password?: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await mockLogin(email, password);
      localStorage.setItem('care_route_mock_user', JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false, error: error.message || 'Login failed' }));
      throw error;
    }
  };

  const register = async (userData: Partial<User>) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await mockRegister(userData);
      localStorage.setItem('care_route_mock_user', JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false, error: error.message || 'Registration failed' }));
      throw error;
    }
  };

  const updateRole = async (role: Role) => {
    if (!state.user) return;
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const user = await mockUpdateRole(state.user.id, role);
      localStorage.setItem('care_route_mock_user', JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error: any) {
      setState((prev) => ({ ...prev, isLoading: false, error: error.message || 'Failed to update role' }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('care_route_mock_user');
    setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
  };

  const loginAsDemoPersona = (persona: User) => {
    localStorage.setItem('care_route_mock_user', JSON.stringify(persona));
    setState({ user: persona, isAuthenticated: true, isLoading: false, error: null });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateRole, loginAsDemoPersona }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
