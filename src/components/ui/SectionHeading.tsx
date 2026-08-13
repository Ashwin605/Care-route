'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { animation } from '@/lib/tokens';

// ============================================================
// CARE ROUTE — Section Heading Component
// ============================================================

interface SectionHeadingProps {
  label?: string;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
  className?: string;
  titleClassName?: string;
  dark?: boolean;
}

export default function SectionHeading({
  label,
  title,
  subtitle,
  align = 'left',
  className = '',
  titleClassName = '',
  dark = false,
}: SectionHeadingProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  const alignClass = align === 'center' ? 'text-center mx-auto' : '';

  return (
    <div
      ref={ref}
      className={`max-w-3xl ${alignClass} ${className}`}
    >
      {label && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: animation.entrance, ease: animation.easeOut }}
          className="text-label mb-4"
        >
          {label}
        </motion.p>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{
          duration: animation.entrance,
          ease: animation.easeOut,
          delay: label ? animation.stagger : 0,
        }}
        className={`text-editorial text-3xl sm:text-4xl md:text-5xl ${
          dark ? 'text-white' : 'text-primary'
        } ${titleClassName}`}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{
            duration: animation.entrance,
            ease: animation.easeOut,
            delay: (label ? animation.stagger * 2 : animation.stagger),
          }}
          className={`mt-5 text-base sm:text-lg leading-relaxed max-w-xl ${
            dark ? 'text-white/60' : 'text-muted'
          } ${align === 'center' ? 'mx-auto' : ''}`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}
