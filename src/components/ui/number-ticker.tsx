'use client'

import { useEffect, useRef } from 'react'
import { useInView, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface NumberTickerProps {
  /** Target numeric value to count up to. */
  value: number
  /** Number of decimal places to render. */
  decimals?: number
  prefix?: string
  suffix?: string
  className?: string
  /** Spring stiffness/damping — lower stiffness = slower count. */
  stiffness?: number
  damping?: number
  /** BCP 47 locale for number/currency formatting. */
  locale?: string
  /** ISO 4217 currency code — when set, renders as localized currency (e.g. "USD"). */
  currency?: string
  /** Whether to group digits (1,000 vs 1000). Ignored when `currency` is set. */
  useGrouping?: boolean
}

/**
 * Animates a number counting up from 0 to `value` once it scrolls into
 * view. Intended for impact stats / campaign totals. Under
 * `prefers-reduced-motion`, renders the final value immediately.
 *
 * Props are plain serializable values (no function props) so this can be
 * dropped straight into a Server Component without crossing the RSC
 * client-boundary function-serialization limit.
 */
export function NumberTicker({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  stiffness = 60,
  damping = 20,
  locale = 'en-US',
  currency,
  useGrouping = true,
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const shouldReduceMotion = useReducedMotion()

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, { stiffness, damping })

  const format = (n: number) => {
    if (currency) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        maximumFractionDigits: decimals,
        minimumFractionDigits: decimals,
      }).format(n)
    }
    return `${prefix}${n.toLocaleString(locale, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping,
    })}${suffix}`
  }

  useEffect(() => {
    if (isInView) {
      motionValue.set(value)
    }
  }, [isInView, motionValue, value])

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = format(latest)
      }
    })
    return unsubscribe
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [springValue, prefix, suffix, decimals, currency, locale, useGrouping])

  if (shouldReduceMotion) {
    return <span className={cn('tabular-nums', className)}>{format(value)}</span>
  }

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {format(0)}
    </span>
  )
}
