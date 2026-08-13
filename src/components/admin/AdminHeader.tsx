'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Menu, User, ShieldAlert, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-[var(--cr-border)] px-6 flex items-center justify-between sticky top-0 z-20">
      
      {/* Mobile Menu Toggle (Left) */}
      <div className="flex items-center md:hidden">
        <button className="text-[var(--cr-deep-text)] hover:text-[var(--cr-primary)] transition-colors">
          <Menu size={24} />
        </button>
      </div>

      {/* Context Indicator (Desktop) */}
      <div className="hidden md:flex items-center gap-2 text-[var(--cr-muted)]">
        <ShieldAlert size={16} />
        <span className="text-[10px] font-bold uppercase tracking-widest">Global Network Administrator</span>
      </div>
      
      {/* User Actions (Right) */}
      <div className="flex items-center gap-4 ml-auto">
        
        {/* User Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 hover:bg-[var(--cr-background)] p-2 rounded-lg transition-colors border border-transparent hover:border-[var(--cr-border)]"
          >
            <div className="w-8 h-8 rounded-full bg-[var(--cr-primary)]/10 flex items-center justify-center text-[var(--cr-primary)]">
              <User size={16} />
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-semibold text-[var(--cr-deep-text)] leading-none mb-1">
                {user?.name || 'Admin User'}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-[var(--cr-muted)] leading-none">
                System Admin
              </div>
            </div>
          </button>

          {/* Simple Dropdown */}
          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-[var(--cr-border)] rounded-lg shadow-lg py-1 z-50">
              <button 
                onClick={() => {
                  logout();
                  setShowMenu(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-[var(--cr-danger)] hover:bg-[var(--cr-danger)]/5 flex items-center gap-2"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
