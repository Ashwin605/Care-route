'use client';

import Link from 'next/link';
import { ArrowRight, Activity, Inbox, Database, Users } from 'lucide-react';
import { motion } from 'framer-motion';

// ============================================================
// CARE ROUTE — Quick Actions
// ============================================================

const actions = [
  { label: 'Update Capacity', href: '/hospital/capacity', icon: Activity },
  { label: 'Incoming Referrals', href: '/hospital/referrals', icon: Inbox },
  { label: 'Manage Resources', href: '/hospital/resources', icon: Database },
  { label: 'Manage Specialists', href: '/hospital/specialists', icon: Users },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {actions.map((action, i) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 + i * 0.05 }}
        >
          <Link
            href={action.href}
            className="group flex items-center justify-between p-4 bg-white border border-border rounded-xl hover:border-primary/30 transition-all hover:shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="text-muted group-hover:text-primary transition-colors">
                <action.icon size={18} strokeWidth={1.5} />
              </div>
              <span className="text-[0.875rem] font-medium text-primary tracking-[-0.01em]">
                {action.label}
              </span>
            </div>
            <ArrowRight size={16} className="text-muted group-hover:text-primary group-hover:translate-x-1 transition-all" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
