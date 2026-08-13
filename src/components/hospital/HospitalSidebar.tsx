'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useHospital } from '@/contexts/HospitalContext';
import { LayoutDashboard, Inbox, Activity, Database, Users, History, Settings, HelpCircle, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

// ============================================================
// CARE ROUTE — Hospital Sidebar
// ============================================================

const navItems = [
  { label: 'Overview', href: '/hospital/dashboard', icon: LayoutDashboard },
  { label: 'Incoming Referrals', href: '/hospital/referrals', icon: Inbox },
  { label: 'Capacity', href: '/hospital/capacity', icon: Activity },
  { label: 'Resources', href: '/hospital/resources', icon: Database },
  { label: 'Specialists', href: '/hospital/specialists', icon: Users },
  { label: 'Referral History', href: '/hospital/history', icon: History },
];

const secondaryNav = [
  { label: 'Settings', href: '#', icon: Settings },
  { label: 'Help', href: '#', icon: HelpCircle },
];

export default function HospitalSidebar() {
  const pathname = usePathname();
  const { profile, incomingReferrals } = useHospital();
  const { logout } = useAuth();
  
  const pendingCount = incomingReferrals.filter(r => r.status === 'AWAITING_RESPONSE').length;

  return (
    <aside className="w-64 bg-primary text-white hidden md:flex flex-col h-screen sticky top-0 border-r border-primary/20 flex-shrink-0">
      {/* Brand */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <Link href="/" className="text-[0.9375rem] font-semibold tracking-[0.04em] uppercase text-white hover:text-white/80 transition-colors">
          CARE ROUTE
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/hospital/dashboard' && pathname.startsWith(item.href));
          const Icon = item.icon;
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-[0.875rem] font-medium transition-colors ${
                isActive 
                  ? 'bg-white/10 text-white' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} strokeWidth={isActive ? 2 : 1.5} className={isActive ? 'text-white' : 'text-white/50'} />
              <span className="flex-1">{item.label}</span>
              
              {/* Badge for incoming referrals */}
              {item.label === 'Incoming Referrals' && pendingCount > 0 && (
                <span className="bg-sage/20 text-sage text-[0.6875rem] font-bold px-2 py-0.5 rounded-full">
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}

        <div className="mt-8 mb-4">
          <p className="px-3 text-[0.6875rem] font-medium uppercase tracking-[0.04em] text-white/30">
            System
          </p>
        </div>

        {secondaryNav.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-md text-[0.875rem] font-medium text-white/50 hover:bg-white/5 hover:text-white transition-colors"
            >
              <Icon size={18} strokeWidth={1.5} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex flex-col gap-1 px-2 mb-4">
          <span className="text-[0.875rem] font-medium text-white">{profile.name}</span>
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${profile.networkStatus === 'OPERATIONAL' ? 'bg-sage' : 'bg-warning'}`} />
            <span className="text-[0.75rem] text-white/50">Network Active</span>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-2 py-2 rounded-md text-[0.8125rem] font-medium text-white/50 hover:bg-white/5 hover:text-white transition-colors text-left"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
