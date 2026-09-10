'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import { fadeInUp, staggerContainer, staggerItem } from '@/lib/motion'

interface RevealProps {
  children: React.ReactNode
  variants?: Variants
  className?: string
  /** Fraction of the element that must be visible before it animates in. */
  amount?: number
  /** Delay in seconds, useful for hand-tuned sequencing outside a StaggerGroup. */
  delay?: number
}

/**
 * Fades/slides content in once it scrolls into view. Wraps framer-motion's
 * `whileInView` with Afribit's shared variants and disables itself under
 * `prefers-reduced-motion` (renders children statically, already visible).
 */
export function Reveal({ children, variants = fadeInUp, className, amount = 0.3, delay = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

interface StaggerGroupProps {
  children: React.ReactNode
  className?: string
  /** Seconds between each child's reveal. */
  staggerChildren?: number
  delayChildren?: number
  amount?: number
}

/**
 * Container for a set of `<StaggerItem>` children — reveals them one after
 * another as the group scrolls into view. Use for card grids, stat rows, etc.
 */
export function StaggerGroup({
  children,
  className,
  staggerChildren = 0.12,
  delayChildren = 0,
  amount = 0.2,
}: StaggerGroupProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={staggerContainer(staggerChildren, delayChildren)}
    >
      {children}
    </motion.div>
  )
}

interface StaggerItemProps {
  children: React.ReactNode
  variants?: Variants
  className?: string
}

/** A direct child of `<StaggerGroup>` — inherits the parent's reveal timing. */
export function StaggerItem({ children, variants = staggerItem, className }: StaggerItemProps) {
  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  )
}
