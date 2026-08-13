'use client';

// ============================================================
// CARE ROUTE — Badge Component
// ============================================================

type BadgeVariant = 'default' | 'success' | 'warning' | 'critical' | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary/5 text-primary border-primary/10',
  success: 'bg-success/8 text-success border-success/12',
  warning: 'bg-warning/8 text-warning border-warning/12',
  critical: 'bg-critical/8 text-critical border-critical/12',
  muted: 'bg-[#F0F2F2] text-muted border-border',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  critical: 'bg-critical',
  muted: 'bg-muted',
};

export default function Badge({
  children,
  variant = 'default',
  className = '',
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 text-[0.6875rem] font-medium tracking-wide uppercase border rounded-full select-none ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
}
