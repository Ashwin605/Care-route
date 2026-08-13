"use client";

import React, { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../contexts/AuthContext';
import { LayoutDashboard, Users, FileText, Activity, User as UserIcon, LogOut, ShieldAlert } from 'lucide-react';
import Navigation from '../../components/navigation/Navigation';

export default function ReferrerLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/auth/login');
      } else if (user?.role !== 'REFERRER') {
        router.push('/');
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--cr-background)]"><div className="w-8 h-8 border-4 border-[var(--cr-primary)] border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!isAuthenticated || user?.role !== 'REFERRER') {
    return null; // Will redirect via useEffect
  }

  const navItems = [
    { name: 'Overview', href: '/referrer', icon: <LayoutDashboard size={20} /> },
    { name: 'Patients', href: '/referrer/patients', icon: <Users size={20} /> },
    { name: 'Referrals', href: '/referrer/referrals', icon: <FileText size={20} /> },
    { name: 'Network', href: '/referrer/network', icon: <Activity size={20} /> },
    { name: 'Profile', href: '/referrer/profile', icon: <UserIcon size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--cr-background)] flex flex-col">
      <Navigation />
      
      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-[var(--cr-border)] flex flex-col shadow-sm z-10 hidden md:flex">
          <div className="p-6 border-b border-[var(--cr-border)]">
            <h2 className="text-xs font-bold text-[var(--cr-muted)] uppercase tracking-widest mb-1">Referrer Workspace</h2>
            <p className="text-sm font-medium text-[var(--cr-deep-text)] truncate">{user.name}</p>
            <p className="text-xs text-[var(--cr-muted)] truncate mt-0.5">{user.organization || 'Independent Provider'}</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/referrer' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                    isActive 
                      ? 'bg-[var(--cr-primary)]/10 text-[var(--cr-primary)] shadow-sm' 
                      : 'text-[var(--cr-muted)] hover:bg-gray-50 hover:text-[var(--cr-deep-text)]'
                  }`}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>
          
          <div className="p-4 border-t border-[var(--cr-border)]">
            <button
              onClick={() => logout()}
              className="flex items-center gap-3 w-full px-4 py-3 text-[var(--cr-critical)] hover:bg-[var(--cr-critical)]/10 rounded-xl transition-colors font-medium text-left"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50">
          <div className="max-w-7xl mx-auto p-4 md:p-8">
            {/* Status Warning if Pending/Inactive */}
            {user.status && user.status !== 'ACTIVE' && (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                <ShieldAlert className="text-yellow-600 shrink-0 mt-0.5" size={20} />
                <div>
                  <h3 className="text-sm font-bold text-yellow-800">Account Status: {user.status}</h3>
                  <p className="text-xs text-yellow-700 mt-1">Your account is currently pending verification. You may have limited access to network features.</p>
                </div>
              </div>
            )}
            
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
