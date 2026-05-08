'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container } from './container'
import { Button } from '@/components/ui/button'

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/programs', label: 'Programs' },
  { href: '/merchants', label: 'Merchant Map' },
  { href: 'https://www.afribit.africa/fedi', label: 'Community', external: true },
  { href: '/contact', label: 'Contact' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-bg-base/90 backdrop-blur-xl border-b border-white/8 shadow-[0_1px_0_0_rgba(255,255,255,0.04)]'
          : 'bg-transparent'
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/Logo/Full logo png transparent.png"
              alt="Afribit"
              width={32}
              height={32}
              className="size-8 object-contain"
              priority
            />
            <span className="font-display text-lg font-semibold tracking-tight text-foreground">
              Afribit
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              link.external ? (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
                >
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Button asChild size="default">
              <Link href="/donate">Fuel BCE ₿</Link>
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/8 bg-bg-base/95 backdrop-blur-xl">
          <Container>
            <nav className="flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-white/5"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              ))}
              <div className="pt-3 border-t border-white/8 mt-2">
                <Button asChild className="w-full">
                  <Link href="/donate">Fuel BCE ₿</Link>
                </Button>
              </div>
            </nav>
          </Container>
        </div>
      )}
    </header>
  )
}
