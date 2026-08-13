'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Input, PasswordInput } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { animation } from '@/lib/tokens';
import Link from 'next/link';

// ============================================================
// CARE ROUTE — Login Form
// ============================================================

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      await login(email, password);
      router.push('/auth/role');
    } catch (err) {
      // Error handled by context
    }
  };

  const handleDemo = async () => {
    try {
      await login('demo@example.com', 'password123');
      router.push('/auth/role');
    } catch (err) {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: animation.easeOut }}
    >
      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-primary mb-2">
        Sign in to your account
      </h2>
      <p className="text-muted text-[0.9375rem] mb-8">
        Enter your details to access your workspace.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: animation.easeOut }}
        >
          <Input
            label="Email address"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: animation.easeOut }}
        >
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          
          <div className="flex items-center justify-between mt-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className="relative flex items-center justify-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="w-4 h-4 rounded-sm border border-border bg-white peer-checked:bg-primary peer-checked:border-primary transition-colors" />
                <svg className="absolute w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-[0.8125rem] text-muted group-hover:text-primary transition-colors">
                Remember me
              </span>
            </label>

            <Link
              href="/forgot-password"
              className="text-[0.8125rem] font-medium text-primary hover:text-primary/70 transition-colors"
            >
              Forgot password?
            </Link>
          </div>
        </motion.div>

        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="text-[0.8125rem] font-medium text-critical"
          >
            {error}
          </motion.p>
        )}

        <motion.div
          className="mt-4 flex flex-col gap-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: animation.easeOut }}
        >
          <Button
            type="submit"
            variant="primary"
            className="w-full justify-center"
            disabled={isLoading || !email || !password}
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="w-full justify-center text-muted hover:text-primary"
            onClick={handleDemo}
            disabled={isLoading}
          >
            Continue as demo user
          </Button>
        </motion.div>
      </form>

      <motion.p
        className="mt-8 text-center text-[0.8125rem] text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        Don't have an account?{' '}
        <Link href="/register" className="font-medium text-primary hover:underline underline-offset-4">
          Create account
        </Link>
      </motion.p>
    </motion.div>
  );
}
