import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  [
    'group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold',
    'transition-all duration-300 ease-out',
    'disabled:pointer-events-none disabled:opacity-40',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bitcoin focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    'overflow-hidden',
  ].join(' '),
  {
    variants: {
      variant: {
        // Primary — bitcoin orange with gradient, glows on hover
        default: [
          'bg-gradient-to-b from-bitcoin via-bitcoin to-[#d97c0e] text-black',
          'shadow-[0_1px_0_rgba(255,255,255,0.25)_inset,0_-1px_0_rgba(0,0,0,0.2)_inset]',
          'hover:shadow-[0_0_28px_6px_rgba(247,147,26,0.35),0_1px_0_rgba(255,255,255,0.25)_inset]',
          'hover:brightness-110 active:brightness-95 active:scale-[0.98]',
        ].join(' '),
        // Outline — border reveals fill on hover
        outline: [
          'border border-white/15 bg-white/[0.03] text-foreground backdrop-blur-sm',
          'hover:border-white/30 hover:bg-white/[0.08] hover:text-foreground',
          'active:scale-[0.98]',
        ].join(' '),
        // Ghost
        ghost: 'bg-transparent text-muted-foreground hover:text-foreground hover:bg-white/5 active:bg-white/8',
        // Secondary
        secondary: 'bg-white/8 text-foreground hover:bg-white/12 active:scale-[0.98]',
        // Destructive
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        // Link
        link: 'text-bitcoin underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-11 px-5 py-2.5',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-12 px-7 text-base',
        xl: 'h-14 px-8 text-base tracking-wide',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
