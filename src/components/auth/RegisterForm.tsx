'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input, PasswordInput } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { animation } from '@/lib/tokens';
import Link from 'next/link';

// ============================================================
// CARE ROUTE — Register Form
// ============================================================

const steps = ['Account', 'Organization', 'Complete'];

export default function RegisterForm() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: '',
    phone: '',
  });

  const { register, isLoading, error } = useAuth();
  const router = useRouter();

  const handleNext = () => {
    if (step < steps.length - 1) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) {
      handleNext();
      return;
    }
    
    try {
      await register(formData);
      router.push('/auth/role');
    } catch (err) {}
  };

  const updateForm = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const isStepValid = () => {
    if (step === 0) return formData.name && formData.email && formData.password.length >= 8;
    if (step === 1) return formData.organization;
    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1, ease: animation.easeOut }}
    >
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`text-[0.6875rem] font-medium uppercase tracking-[0.04em] transition-colors ${
                i === step ? 'text-primary' : i < step ? 'text-primary/40' : 'text-muted/30'
              }`}
            >
              {String(i + 1).padStart(2, '0')} {s}
            </div>
            {i < steps.length - 1 && (
              <div className={`w-8 h-px ${i < step ? 'bg-primary/20' : 'bg-border/60'}`} />
            )}
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-semibold tracking-[-0.02em] text-primary mb-2">
        {step === 0 && 'Create your account'}
        {step === 1 && 'Professional details'}
        {step === 2 && 'Ready to continue'}
      </h2>
      <p className="text-muted text-[0.9375rem] mb-8 h-5">
        {step === 0 && 'Enter your basic information to get started.'}
        {step === 1 && 'Tell us where you work.'}
        {step === 2 && 'Your account is ready to be created.'}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col min-h-[260px]">
        <div className="flex-1 relative">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: animation.easeOut }}
                className="flex flex-col gap-5 absolute inset-0"
              >
                <Input
                  label="Full name"
                  placeholder="Dr. Jane Doe"
                  value={formData.name}
                  onChange={(e) => updateForm('name', e.target.value)}
                  autoFocus
                />
                <Input
                  label="Email address"
                  type="email"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) => updateForm('email', e.target.value)}
                />
                <PasswordInput
                  label="Password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateForm('password', e.target.value)}
                  helperText="Must be at least 8 characters."
                />
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: animation.easeOut }}
                className="flex flex-col gap-5 absolute inset-0"
              >
                <Input
                  label="Organization / Hospital"
                  placeholder="CityCare General Hospital"
                  value={formData.organization}
                  onChange={(e) => updateForm('organization', e.target.value)}
                  autoFocus
                />
                <Input
                  label="Phone number (Optional)"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => updateForm('phone', e.target.value)}
                />
                
                <div className="mt-2 p-4 bg-primary/4 border border-primary/10 rounded-md">
                   <p className="text-[0.8125rem] text-primary/70 leading-relaxed">
                     <strong className="font-medium text-primary">Note for Admins:</strong> Administrator accounts are provisioned directly by the CARE ROUTE platform. You will be able to select Referrer or Hospital Staff in the next step.
                   </p>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: animation.easeOut }}
                className="flex flex-col gap-5 absolute inset-0"
              >
                <div className="p-6 bg-white border border-border rounded-lg shadow-sm">
                   <div className="space-y-4">
                     <div>
                       <p className="text-[0.75rem] text-muted uppercase tracking-[0.04em]">Name</p>
                       <p className="font-medium text-primary mt-1">{formData.name}</p>
                     </div>
                     <div>
                       <p className="text-[0.75rem] text-muted uppercase tracking-[0.04em]">Email</p>
                       <p className="font-medium text-primary mt-1">{formData.email}</p>
                     </div>
                     <div>
                       <p className="text-[0.75rem] text-muted uppercase tracking-[0.04em]">Organization</p>
                       <p className="font-medium text-primary mt-1">{formData.organization}</p>
                     </div>
                   </div>
                </div>
                
                {error && (
                  <p className="text-[0.8125rem] font-medium text-critical mt-2">{error}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBack}
            className={`px-0 hover:bg-transparent hover:text-primary/70 ${step === 0 ? 'invisible' : ''}`}
          >
            ← Back
          </Button>

          <Button
            type="submit"
            variant="primary"
            disabled={!isStepValid() || isLoading}
            className="min-w-[120px] justify-center"
          >
            {isLoading ? 'Creating...' : step === steps.length - 1 ? 'Create Account' : 'Continue →'}
          </Button>
        </div>
      </form>

      {step === 0 && (
        <motion.p
          className="mt-8 text-center text-[0.8125rem] text-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-primary hover:underline underline-offset-4">
            Sign in
          </Link>
        </motion.p>
      )}
    </motion.div>
  );
}
