import { cn } from '@/lib/utils'

export type SectionBackgroundVariant =
  | 'hero'
  | 'orange-wash'
  | 'green-wash'
  | 'grid'
  | 'dot'
  | 'panel'
  | 'none'

interface SectionBackgroundProps {
  variant?: SectionBackgroundVariant
  className?: string
}

/**
 * Centralizes the ad-hoc `bg-[radial-gradient(...)]` strings + grid/dot/noise
 * layers repeated across page heroes and sections. Renders a single
 * absolutely-positioned, `pointer-events-none`, `aria-hidden` layer behind
 * section content — drop it as the first child of a `position: relative`
 * section and keep real content in a sibling wrapped with `relative z-10`.
 *
 * This is additive: no existing section has been switched over yet. Existing
 * `.bg-dot-grid` / `.bg-grid-lines` / `.section-panel` classes still work as
 * before.
 */
export function SectionBackground({ variant = 'none', className }: SectionBackgroundProps) {
  if (variant === 'none') return null

  return (
    <div
      aria-hidden
      className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)}
    >
      {variant === 'hero' && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(247,147,26,0.18),transparent_38rem)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,135,81,0.14),transparent_34rem)]" />
          <div className="absolute inset-0 bg-grid-lines opacity-30" />
        </>
      )}
      {variant === 'orange-wash' && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(247,147,26,0.14),transparent_70%)]" />
      )}
      {variant === 'green-wash' && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,rgba(0,135,81,0.12),transparent_70%)]" />
      )}
      {variant === 'grid' && <div className="absolute inset-0 bg-grid-lines opacity-40" />}
      {variant === 'dot' && <div className="absolute inset-0 bg-dot-grid opacity-60" />}
      {variant === 'panel' && (
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_0%,rgba(247,147,26,0.13),transparent_24rem)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_90%_12%,rgba(0,135,81,0.11),transparent_22rem)]" />
        </>
      )}
    </div>
  )
}
