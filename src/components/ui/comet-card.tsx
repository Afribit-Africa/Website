import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CometCardProps {
  children: ReactNode
  className?: string
}

export function CometCard({ children, className }: CometCardProps) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#1f2121]',
        'shadow-[0_18px_50px_rgba(0,0,0,0.28)] transition-transform duration-500 ease-out',
        'hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.35)]',
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(247,147,26,0.18),transparent_30%),radial-gradient(circle_at_80%_100%,rgba(255,255,255,0.08),transparent_24%)]" />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
      </div>
      {children}
    </div>
  )
}