// ============================================================
// CARE ROUTE — Design Tokens
// ============================================================
// Centralized design language: colors, typography, spacing, motion.
// All values match the project's restrained, premium palette.

export const colors = {
  background: '#F7F8F6',
  primary: '#123B4A',
  deepText: '#172126',
  secondary: '#2F6673',
  sage: '#6F9690',
  success: '#3F8068',
  warning: '#A98245',
  critical: '#A65353',
  border: '#DCE3E3',
  white: '#FFFFFF',
  muted: '#68757A',
} as const;

export const animation = {
  /** Standard entrance duration */
  entrance: 0.7,
  /** Fast micro-interactions */
  fast: 0.3,
  /** Slow reveals */
  slow: 1.0,
  /** Stagger between sibling elements */
  stagger: 0.12,
  /** Smooth cubic easing */
  easeOut: [0.16, 1, 0.3, 1] as const,
  /** Gentle spring-like easing */
  easeInOut: [0.4, 0, 0.2, 1] as const,
} as const;

export const motionPresets = {
  fadeUp: {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: animation.entrance,
      ease: animation.easeOut,
    },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
      duration: animation.entrance,
      ease: animation.easeOut,
    },
  },
  fadeScale: {
    initial: { opacity: 0, scale: 0.96 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      duration: animation.entrance,
      ease: animation.easeOut,
    },
  },
  slideRight: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    transition: {
      duration: animation.entrance,
      ease: animation.easeOut,
    },
  },
} as const;
