'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface TextRevealProps {
  text: string
  className?: string
  /** Element to render as — defaults to a span so it can sit inside a heading. */
  as?: React.ElementType
  /** Seconds between each word's reveal. */
  staggerDelay?: number
}

/**
 * Word-by-word blur/opacity/translate-in reveal for headlines. Splits on
 * whitespace and animates each word once it scrolls into view. Falls back to
 * plain static text under `prefers-reduced-motion`.
 */
export function TextReveal({ text, className, as: Comp = 'span', staggerDelay = 0.06 }: TextRevealProps) {
  const shouldReduceMotion = useReducedMotion()
  const words = text.split(' ')

  if (shouldReduceMotion) {
    return <Comp className={className}>{text}</Comp>
  }

  return (
    <Comp className={cn('inline-block', className)}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block will-change-transform"
          initial={{ opacity: 0, y: '0.4em', filter: 'blur(6px)' }}
          whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * staggerDelay }}
        >
          {word}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </Comp>
  )
}
