import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  eyebrow?: string
  title: React.ReactNode
  description?: React.ReactNode
  align?: 'center' | 'left'
  className?: string
  titleClassName?: string
  descriptionClassName?: string
}

/**
 * The eyebrow + heading + intro paragraph block repeated across most home
 * and page sections (see `impact-stats.tsx`, `faq.tsx`, etc.). Extracted so
 * new sections don't re-hand-roll it; existing sections are left as-is for
 * this pass.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
  titleClassName,
  descriptionClassName,
}: SectionHeaderProps) {
  const isCentered = align === 'center'

  return (
    <div
      className={cn(
        'flex w-full max-w-2xl flex-col gap-4 mb-12',
        isCentered ? 'mx-auto items-center text-center' : 'mx-0 items-start text-left',
        className
      )}
    >
      {eyebrow ? (
        <p className="text-xs text-bitcoin uppercase tracking-widest font-semibold">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cn('font-display text-3xl sm:text-4xl font-bold text-foreground', titleClassName)}>
        {title}
      </h2>
      {description ? (
        <p className={cn('text-lg text-muted-foreground max-w-xl', descriptionClassName)}>
          {description}
        </p>
      ) : null}
    </div>
  )
}
