import React from 'react';
import { CapacityPressure as PressureType } from '../../types/intelligence';
import { AlertCircle, AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';

interface CapacityPressureProps {
  pressure: PressureType;
  size?: 'sm' | 'md';
  className?: string;
}

export default function CapacityPressure({ pressure, size = 'md', className = '' }: CapacityPressureProps) {
  let icon, color, label;
  
  const isSm = size === 'sm';
  const iconSize = isSm ? 12 : 16;

  switch (pressure) {
    case 'LOW':
      icon = <CheckCircle2 size={iconSize} className="shrink-0" />;
      color = 'text-[var(--cr-success)] bg-[var(--cr-success)]/10 border-[var(--cr-success)]/20';
      label = 'Low Pressure';
      break;
    case 'MODERATE':
      icon = <ArrowRight size={iconSize} className="shrink-0" />;
      color = 'text-[var(--cr-secondary)] bg-[var(--cr-secondary)]/10 border-[var(--cr-secondary)]/20';
      label = 'Moderate Pressure';
      break;
    case 'HIGH':
      icon = <AlertTriangle size={iconSize} className="shrink-0" />;
      color = 'text-[var(--cr-warning)] bg-[var(--cr-warning)]/10 border-[var(--cr-warning)]/20';
      label = 'High Pressure';
      break;
    case 'CRITICAL':
      icon = <AlertCircle size={iconSize} className="shrink-0" />;
      color = 'text-[var(--cr-critical)] bg-[var(--cr-critical)]/10 border-[var(--cr-critical)]/20';
      label = 'Critical Pressure';
      break;
  }

  const sizeClasses = isSm
    ? 'px-2 py-0.5 text-[10px] gap-1 font-bold'
    : 'px-2.5 py-1 text-xs gap-1.5 font-bold';

  return (
    <div className={`inline-flex items-center rounded-md border uppercase tracking-wider whitespace-nowrap shrink-0 ${sizeClasses} ${color} ${className}`}>
      {icon}
      <span>{label}</span>
    </div>
  );
}
