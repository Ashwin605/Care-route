'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Role } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { animation } from '@/lib/tokens';
import { UserRound, Building2, ShieldAlert } from 'lucide-react';

// ============================================================
// CARE ROUTE — Role Selector
// ============================================================

const roles: { id: Role; title: string; description: string; icon: any; route: string }[] = [
  {
    id: 'REFERRER',
    title: 'Referrer',
    description: 'For doctors and healthcare professionals. Create referrals, find suitable hospitals, and track patients.',
    icon: UserRound,
    route: '/referrer/dashboard',
  },
  {
    id: 'HOSPITAL_STAFF',
    title: 'Hospital Staff',
    description: 'Manage capacity and incoming referrals. Update beds, manage resources, and accept referrals.',
    icon: Building2,
    route: '/hospital/dashboard',
  },
  {
    id: 'ADMIN',
    title: 'Admin',
    description: 'Manage the CARE ROUTE network. Oversee hospitals, users, and platform activity.',
    icon: ShieldAlert,
    route: '/admin/dashboard',
  },
];

export default function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const { updateRole, isLoading } = useAuth();
  const router = useRouter();

  const handleContinue = async () => {
    if (!selectedRole) return;
    try {
      await updateRole(selectedRole);
      const route = roles.find(r => r.id === selectedRole)?.route;
      if (route) router.push(route);
    } catch (err) {}
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 md:py-24 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: animation.easeOut }}
        className="text-center mb-16"
      >
        <h1 className="text-editorial text-3xl md:text-5xl text-primary leading-[1.1] mb-4">
          HOW WILL YOU USE<br />CARE ROUTE?
        </h1>
        <p className="text-muted text-lg">Choose your role to continue.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {roles.map((role, i) => {
          const isSelected = selectedRole === role.id;
          const Icon = role.icon;
          
          return (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 + i * 0.1, ease: animation.easeOut }}
              onClick={() => setSelectedRole(role.id)}
              className={`relative text-left flex flex-col p-8 rounded-xl border transition-all duration-300 ease-out group outline-none focus-visible:ring-4 focus-visible:ring-primary/20 ${
                isSelected
                  ? 'bg-white border-primary shadow-[0_8px_30px_rgba(18,59,74,0.08)] scale-[1.02] z-10'
                  : selectedRole
                  ? 'bg-white/50 border-border/60 opacity-60 hover:opacity-100 hover:bg-white scale-100'
                  : 'bg-white border-border hover:border-primary/30 hover:shadow-sm scale-100'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-colors duration-300 ${
                  isSelected ? 'bg-primary/10 text-primary' : 'bg-background text-muted group-hover:text-primary group-hover:bg-primary/5'
                }`}
              >
                <Icon strokeWidth={1.5} className={`transition-transform duration-300 ${isSelected ? 'scale-110' : 'group-hover:scale-110'}`} />
              </div>
              
              <h3 className={`text-xl font-semibold tracking-[-0.01em] mb-3 transition-colors ${
                isSelected ? 'text-primary' : 'text-primary'
              }`}>
                {role.title}
              </h3>
              
              <p className={`text-[0.9375rem] leading-relaxed transition-colors flex-1 ${
                isSelected ? 'text-muted' : 'text-muted'
              }`}>
                {role.description}
              </p>

              <div className="mt-8 pt-6 border-t border-border/50 w-full flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className={`text-[0.8125rem] font-medium ${isSelected ? 'text-primary' : 'text-muted group-hover:text-primary'}`}>
                  Select {role.title}
                </span>
                <span className={`text-xl ${isSelected ? 'text-primary translate-x-1' : 'text-muted/50 group-hover:text-primary group-hover:translate-x-1'} transition-all`}>
                  →
                </span>
              </div>
              
              {/* Active Indicator Ring */}
              {isSelected && (
                <motion.div
                  layoutId="role-outline"
                  className="absolute inset-0 border-2 border-primary rounded-xl pointer-events-none"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedRole ? 1 : 0, y: selectedRole ? 0 : 10 }}
        transition={{ duration: 0.4 }}
        className="flex justify-center"
      >
        <Button
          variant="primary"
          size="lg"
          onClick={handleContinue}
          disabled={!selectedRole || isLoading}
          className="min-w-[200px]"
        >
          {isLoading ? 'Entering workspace...' : `Continue as ${roles.find(r => r.id === selectedRole)?.title || ''} →`}
        </Button>
      </motion.div>
    </div>
  );
}
