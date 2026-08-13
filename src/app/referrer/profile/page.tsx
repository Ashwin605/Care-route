"use client";
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { ShieldCheck, User as UserIcon, Building2, Phone, Briefcase } from 'lucide-react';

export default function ReferrerProfile() {
  const { user } = useAuth();
  
  if (!user) return null;

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--cr-deep-text)] tracking-tight">Professional Profile</h1>
          <p className="text-[var(--cr-muted)] mt-1">Manage your credentials and organization details.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-[var(--cr-primary)]/20 to-[var(--cr-secondary)]/20"></div>
        <div className="px-8 pb-8">
          <div className="-mt-12 mb-6 flex items-end justify-between">
            <div className="w-24 h-24 bg-white rounded-full p-2 shadow-sm border border-[var(--cr-border)]">
              <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <UserIcon size={40} />
              </div>
            </div>
            <span className="bg-[var(--cr-success)]/10 text-[var(--cr-success)] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 mb-2">
              <ShieldCheck size={14} /> {user.role}
            </span>
          </div>
          
          <h2 className="text-2xl font-bold text-[var(--cr-deep-text)]">{user.name}</h2>
          <p className="text-[var(--cr-muted)] font-medium mt-1">{user.email}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] flex items-center gap-1 mb-1">
                  <Building2 size={12} /> Organization
                </label>
                <p className="font-medium text-[var(--cr-deep-text)]">{user.organization || 'Independent Provider'}</p>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] flex items-center gap-1 mb-1">
                  <Phone size={12} /> Contact
                </label>
                <p className="font-medium text-[var(--cr-deep-text)]">{user.phone || 'Not provided'}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] flex items-center gap-1 mb-1">
                  <Briefcase size={12} /> Specialization
                </label>
                <p className="font-medium text-[var(--cr-deep-text)]">{user.specialization || 'General Practice'}</p>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-[var(--cr-muted)] flex items-center gap-1 mb-1">
                  Account Status
                </label>
                <p className="font-medium text-[var(--cr-deep-text)] capitalize">{user.status?.toLowerCase() || 'Active'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
