'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { animation } from '@/lib/tokens';
import Link from 'next/link';

// ============================================================
// CARE ROUTE — Forgot Password Form
// ============================================================

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: animation.easeOut }}
    >
      <Link
        href="/login"
        className="inline-flex items-center text-[0.8125rem] font-medium text-muted hover:text-primary transition-colors mb-8"
      >
        ← Back to sign in
      </Link>

      {!isSubmitted ? (
        <>
          <h2 className="text-2xl font-semibold tracking-[-0.02em] text-primary mb-2">
            Reset password
          </h2>
          <p className="text-muted text-[0.9375rem] mb-8">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              label="Email address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center"
              disabled={isLoading || !email}
            >
              {isLoading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: animation.easeOut }}
          className="py-6 flex flex-col items-center text-center"
        >
          <div className="w-16 h-16 rounded-full bg-success/10 border border-success/20 flex items-center justify-center text-success mb-6">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold tracking-[-0.02em] text-primary mb-2">
            Check your inbox
          </h2>
          <p className="text-muted text-[0.9375rem] mb-8 max-w-[280px]">
            We've sent a password reset link to <strong className="font-medium text-primary">{email}</strong>.
          </p>
          
          <Button
            href="/login"
            variant="outline"
            className="w-full justify-center"
          >
            Return to sign in
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
