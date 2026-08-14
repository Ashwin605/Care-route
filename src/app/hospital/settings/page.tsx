"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Shield, Bell, Key, Building2 } from 'lucide-react';

export default function HospitalSettings() {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <p className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-[var(--cr-muted)] mb-4">
          Configuration
        </p>
        <h1 className="text-4xl md:text-[3rem] font-bold text-[var(--cr-deep-text)] tracking-tight leading-[1.06] mb-2">
          Settings
        </h1>
        <p className="text-[var(--cr-muted)] text-lg max-w-xl">
          Manage your hospital's account, notification preferences, and security settings.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-2">
          <div className="p-4 bg-[var(--cr-primary)]/5 text-[var(--cr-primary)] rounded-xl font-bold flex items-center gap-3 cursor-pointer">
            <Building2 size={20} />
            Hospital Profile
          </div>
          <div className="p-4 text-[var(--cr-muted)] hover:bg-gray-50 rounded-xl font-bold flex items-center gap-3 cursor-pointer transition-colors">
            <Bell size={20} />
            Notifications
          </div>
          <div className="p-4 text-[var(--cr-muted)] hover:bg-gray-50 rounded-xl font-bold flex items-center gap-3 cursor-pointer transition-colors">
            <Shield size={20} />
            Security
          </div>
          <div className="p-4 text-[var(--cr-muted)] hover:bg-gray-50 rounded-xl font-bold flex items-center gap-3 cursor-pointer transition-colors">
            <Key size={20} />
            API Access
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] p-8">
            <h2 className="text-xl font-bold text-[var(--cr-deep-text)] mb-6">Hospital Profile</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[var(--cr-deep-text)] mb-2">Hospital Name</label>
                <input type="text" defaultValue="CityCare Hospital" className="w-full p-3 bg-gray-50 border border-[var(--cr-border)] rounded-xl focus:outline-none focus:border-[var(--cr-primary)] transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--cr-deep-text)] mb-2">Address</label>
                <textarea defaultValue="123 Medical Center Blvd, Health City, HC 12345" className="w-full p-3 bg-gray-50 border border-[var(--cr-border)] rounded-xl focus:outline-none focus:border-[var(--cr-primary)] transition-colors h-24 resize-none" />
              </div>
              <div className="pt-4 flex justify-end">
                <button className="bg-[var(--cr-primary)] hover:bg-[var(--cr-primary-hover)] text-white px-6 py-2.5 rounded-xl font-bold shadow-sm transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
