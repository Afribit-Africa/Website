import type { Transition, Variants } from 'framer-motion'

/**
 * Shared motion tokens + variants for Afribit's reveal/stagger primitives
 * (`<Reveal>`, `<StaggerGroup>`, `<NumberTicker>`, `<TextReveal>`).
 *
 * Keep this the single source of truth for durations/easings so every
 * section reveal feels consistent. `prefers-reduced-motion` is handled by
 * the consuming client components via framer-motion's `useReducedMotion`,
 * not here.
 */

export const durations = {
  fast: 0.35,
  base: 0.55,
  slow: 0.85,
} as const

export const easings = {
  out: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const satisfies Record<string, Transition['ease']>

export const springs = {
  soft: { type: 'spring', stiffness: 120, damping: 20, mass: 0.6 },
  snappy: { type: 'spring', stiffness: 260, damping: 24, mass: 0.5 },
} as const satisfies Record<string, Transition>

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.base, ease: easings.out },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.base, ease: easings.out },
  },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durations.base, ease: easings.out },
  },
}

export const staggerContainer = (staggerChildren = 0.12, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren, delayChildren },
  },
})

export const staggerItem: Variants = fadeInUp
