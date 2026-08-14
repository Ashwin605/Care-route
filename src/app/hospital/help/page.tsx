"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, BookOpen, MessageSquare, PhoneCall } from 'lucide-react';

export default function HospitalHelp() {
  return (
    <div className="p-6 md:p-10 lg:p-12 max-w-[1400px] mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <p className="text-[0.6875rem] font-medium tracking-[0.08em] uppercase text-[var(--cr-muted)] mb-4">
          Support
        </p>
        <h1 className="text-4xl md:text-[3rem] font-bold text-[var(--cr-deep-text)] tracking-tight leading-[1.06] mb-2">
          Help Center
        </h1>
        <p className="text-[var(--cr-muted)] text-lg max-w-xl">
          Get assistance with Care Route, read the documentation, or contact support.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] p-8 hover:border-[var(--cr-primary)] transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-[var(--cr-primary)]/10 text-[var(--cr-primary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <BookOpen size={24} />
          </div>
          <h3 className="text-lg font-bold text-[var(--cr-deep-text)] mb-2">Documentation</h3>
          <p className="text-sm text-[var(--cr-muted)]">Read our comprehensive guides on how to use the hospital workspace effectively.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] p-8 hover:border-[var(--cr-primary)] transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-[var(--cr-primary)]/10 text-[var(--cr-primary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-lg font-bold text-[var(--cr-deep-text)] mb-2">Live Chat</h3>
          <p className="text-sm text-[var(--cr-muted)]">Connect with a support representative right away for quick questions.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[var(--cr-border)] p-8 hover:border-[var(--cr-primary)] transition-colors cursor-pointer group">
          <div className="w-12 h-12 rounded-full bg-[var(--cr-primary)]/10 text-[var(--cr-primary)] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <PhoneCall size={24} />
          </div>
          <h3 className="text-lg font-bold text-[var(--cr-deep-text)] mb-2">Contact Us</h3>
          <p className="text-sm text-[var(--cr-muted)]">Call our 24/7 dedicated support line for critical network issues.</p>
        </div>
      </div>
    </div>
  );
}
