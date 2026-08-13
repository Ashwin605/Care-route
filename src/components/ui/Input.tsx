'use client';

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

// ============================================================
// CARE ROUTE — Input Primitive
// ============================================================

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

    return (
      <div className="w-full flex flex-col gap-1.5">
        <label
          htmlFor={inputId}
          className="text-[0.8125rem] font-medium text-primary tracking-[-0.01em]"
        >
          {label}
        </label>
        <div className="relative">
          <input
            id={inputId}
            ref={ref}
            className={`w-full bg-white border ${
              error ? 'border-critical focus:border-critical' : 'border-border focus:border-primary/50'
            } rounded-md px-4 py-3 text-[0.9375rem] text-primary placeholder:text-muted/50 transition-colors duration-200 outline-none focus:ring-4 ${
              error ? 'focus:ring-critical/10' : 'focus:ring-primary/5'
            } ${className}`}
            {...props}
          />
        </div>
        {(error || helperText) && (
          <p
            className={`text-[0.75rem] mt-0.5 ${
              error ? 'text-critical font-medium' : 'text-muted'
            }`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// ============================================================
// Password Input with Reveal
// ============================================================

export const PasswordInput = forwardRef<HTMLInputElement, Omit<InputProps, 'type'>>(
  ({ className = '', ...props }, ref) => {
    const [show, setShow] = useState(false);

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={show ? 'text' : 'password'}
          className={`pr-10 ${className}`}
          {...props}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-[34px] text-muted hover:text-primary transition-colors focus:outline-none"
          aria-label={show ? 'Hide password' : 'Show password'}
        >
          {show ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';
