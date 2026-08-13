'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNetworkState } from '@/contexts/NetworkStateContext';
import { DEMO_PERSONAS } from '@/lib/demoPersonas';
import { useRouter } from 'next/navigation';
import { Users, RotateCcw, ChevronUp, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DemoSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, loginAsDemoPersona } = useAuth();
  const { resetDemoState } = useNetworkState();
  const router = useRouter();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Don't render if not in demo mode
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== 'true') return null;

  const handleSwitchPersona = (personaKey: string) => {
    const persona = DEMO_PERSONAS[personaKey];
    if (persona) {
      loginAsDemoPersona(persona);
      
      // Navigate to workspace
      if (persona.role === 'ADMIN') router.push('/admin/dashboard');
      else if (persona.role === 'HOSPITAL_STAFF') router.push('/hospital');
      else if (persona.role === 'REFERRER') router.push('/referrer');
      else router.push('/'); // Patient
      
      setIsOpen(false);
    }
  };

  const handleReset = () => {
    resetDemoState();
    setIsOpen(false);
    alert("Demo state has been reset to initial seed values.");
  };

  const personas = [
    { key: 'PATIENT', label: 'Patient' },
    { key: 'REFERRER', label: 'Referrer' },
    { key: 'HOSPITAL_STAFF', label: 'Hospital Staff' },
    { key: 'ADMIN', label: 'Admin' }
  ];

  return (
    <div className="fixed bottom-6 left-6 z-[100]" ref={menuRef}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-0 mb-4 w-64 bg-white rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.15)] border border-[var(--cr-border)] overflow-hidden"
          >
            <div className="bg-[var(--cr-background)] p-3 border-b border-[var(--cr-border)] flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest uppercase text-[var(--cr-muted)]">Demo Personas</span>
              <button 
                onClick={handleReset}
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500 bg-red-50 px-2 py-1 rounded hover:bg-red-100 transition-colors"
              >
                <RotateCcw size={12} />
                Reset Demo
              </button>
            </div>
            <div className="p-2 space-y-1">
              {personas.map(p => {
                const isActive = (user?.role === p.key || (!user?.role && p.key === 'PATIENT'));
                return (
                  <button
                    key={p.key}
                    onClick={() => handleSwitchPersona(p.key)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                      isActive ? 'bg-[var(--cr-primary)]/10 text-[var(--cr-primary)]' : 'hover:bg-gray-50 text-[var(--cr-deep-text)]'
                    }`}
                  >
                    <UserIcon size={16} />
                    <div>
                      <div className="text-sm font-bold">{p.label}</div>
                      <div className="text-[10px] uppercase tracking-widest opacity-70">
                        {DEMO_PERSONAS[p.key].name}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-full shadow-lg font-bold text-xs uppercase tracking-wider border transition-all ${
          isOpen ? 'bg-[var(--cr-primary)] text-white border-[var(--cr-primary)]' : 'bg-white text-[var(--cr-primary)] border-[var(--cr-primary)]/20 hover:bg-gray-50'
        }`}
      >
        <Users size={16} />
        Demo Persona
        <ChevronUp size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
    </div>
  );
}
