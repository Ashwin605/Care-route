'use client';

import { forwardRef } from 'react';

// ============================================================
// CARE ROUTE — Button Component
// ============================================================

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'inverted'
  | 'inverted-ghost'
  | 'ghost'
  | 'outline'
  | 'success'
  | 'critical-outline';

export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white border border-primary hover:bg-[#0e3240] active:bg-[#0a2530]',
  secondary:
    'bg-white text-primary border border-border hover:border-primary/30 hover:bg-[#F7F8F6] active:bg-[#EFF2F0]',
  inverted:
    'bg-white text-primary border border-white hover:bg-white/95 active:bg-white/90 shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.16)]',
  'inverted-ghost':
    'bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30 backdrop-blur-xs',
  ghost:
    'bg-transparent text-primary hover:bg-primary/5 active:bg-primary/10 border border-transparent',
  outline:
    'bg-transparent text-primary border border-border hover:border-primary/40 active:bg-primary/5',
  success:
    'bg-success text-white border border-success hover:bg-[#356e59] active:bg-[#2c5b4a]',
  'critical-outline':
    'bg-transparent text-critical border border-critical/30 hover:bg-critical/5 hover:border-critical/50',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-[0.8125rem] gap-1.5',
  md: 'px-6 py-3 text-sm gap-2',
  lg: 'px-7 py-3.5 text-[0.9375rem] gap-2.5 font-semibold',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, href, ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center tracking-[-0.01em] rounded-md transition-all duration-200 ease-out cursor-pointer select-none whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary disabled:opacity-50 disabled:cursor-not-allowed';

    const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim();

    if (href) {
      return (
        <a href={href} className={classes} tabIndex={0}>
          {children}
        </a>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
