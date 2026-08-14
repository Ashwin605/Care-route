import React, { useState, useRef, useEffect } from 'react';
import { useHospital } from '@/contexts/HospitalContext';
import { Bell, User, X, Clock, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
import NetworkStatusIndicator from './NetworkStatus';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// CARE ROUTE — Hospital Header
// ============================================================

export default function HospitalHeader() {
  const { profile, incomingReferrals } = useHospital();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const pendingCount = incomingReferrals.filter(r => r.status === 'AWAITING_RESPONSE').length;
  const badgeCount = pendingCount > 0 ? pendingCount : 4; // Using 4 for demo purposes as requested

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      type: 'urgent',
      title: 'New Critical Referral',
      message: 'A critical cardiac patient is being referred from Regional Health.',
      time: '2 mins ago',
      icon: <AlertTriangle size={16} className="text-[var(--cr-critical)]" />,
      read: false
    },
    {
      id: 2,
      type: 'action',
      title: 'Capacity Update Required',
      message: 'ICU capacity has been at 100% for 24 hours. Please verify.',
      time: '1 hour ago',
      icon: <Clock size={16} className="text-[var(--cr-warning)]" />,
      read: false
    },
    {
      id: 3,
      type: 'info',
      title: 'Referral Accepted',
      message: 'Patient REF-20394 arrival confirmed for 14:00 today.',
      time: '3 hours ago',
      icon: <CheckCircle2 size={16} className="text-[var(--cr-success)]" />,
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Monthly Report Ready',
      message: 'Your hospital performance report for July is now available.',
      time: '1 day ago',
      icon: <FileText size={16} className="text-[var(--cr-primary)]" />,
      read: true
    }
  ];

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-6">
        <h2 className="text-[0.9375rem] font-semibold text-primary">{profile.name}</h2>
        <div className="hidden sm:block w-px h-4 bg-border" />
        <div className="hidden sm:block">
          <NetworkStatusIndicator minimal />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-muted hover:text-primary transition-colors rounded-full hover:bg-background"
          >
            <Bell size={18} strokeWidth={1.5} />
            {badgeCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-[var(--cr-critical)] text-white text-[9px] font-bold rounded-full flex items-center justify-center border border-white">
                {badgeCount}
              </span>
            )}
          </button>
          
          <AnimatePresence>
            {isNotificationsOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-[var(--cr-border)] overflow-hidden z-50"
              >
                <div className="p-4 border-b border-[var(--cr-border)] flex items-center justify-between bg-gray-50/50">
                  <h3 className="font-bold text-[var(--cr-deep-text)]">Notifications</h3>
                  <button className="text-xs font-bold text-[var(--cr-primary)] hover:underline">
                    Mark all as read
                  </button>
                </div>
                
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border-b border-[var(--cr-border)] last:border-0 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${!notification.read ? 'bg-[var(--cr-primary)]/[0.02]' : ''}`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {notification.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <h4 className={`text-sm font-bold ${!notification.read ? 'text-[var(--cr-deep-text)]' : 'text-[var(--cr-deep-text)]/80'}`}>
                            {notification.title}
                          </h4>
                          <span className="text-[10px] font-bold uppercase text-[var(--cr-muted)] whitespace-nowrap">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--cr-muted)] leading-relaxed">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-[var(--cr-primary)] mt-1.5 shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t border-[var(--cr-border)] text-center bg-gray-50/50">
                  <button className="text-xs font-bold text-[var(--cr-muted)] hover:text-[var(--cr-primary)] transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <button className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center text-primary hover:bg-border/50 transition-colors">
          <User size={16} strokeWidth={1.5} />
        </button>
      </div>
    </header>
  );
}
