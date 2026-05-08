'use client'

import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-bg-base">
      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ transform: 'scale(1)', transformOrigin: '68% 42%' }}
        src="/Videos/Home hero section video.mp4"
      />
      {/* Left-to-right fade: solid on left, fades to nothing on right */}
      <div className="absolute inset-0 bg-gradient-to-r from-bg-base from-[40%] via-bg-base/70 via-[65%] to-bg-base/0" />
      {/* Top/bottom vignette */}
      <div className="absolute inset-0 bg-gradient-to-b from-bg-base/50 via-bg-base/0 to-bg-base/60" />

      <Container className="relative z-10">
        <div className="max-w-xl pt-24 pb-20 lg:pt-32 lg:pb-28">
          {/* Badge */}
          <div className="mb-7">
            <Badge variant="default" className="gap-1.5 py-1 px-3 text-xs">
              <span className="size-1.5 rounded-full bg-bitcoin animate-pulse" />
              Bitcoin Circular Economy — Kibera, Nairobi
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.08]">
            Empowering African{' '}
            <span className="text-bitcoin relative inline-block">
              Communities
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-bitcoin/30 rounded-full" />
            </span>{' '}
            Through Bitcoin
          </h1>

          {/* Sub-headline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mb-14 leading-relaxed">
            Afribit is building a self-sustaining Bitcoin circular economy in Kibera — connecting
            merchants, households, and programs through the Lightning Network.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Button asChild size="xl" className="w-full sm:w-auto">
              <Link href="/donate">
                <span>Fuel the Movement</span>
                <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
              <Button asChild size="xl" variant="outline" className="w-full sm:w-auto">
                <Link href="https://www.afribit.africa/about" target="_blank" rel="noreferrer">
                <Play className="size-4 transition-transform duration-300 group-hover:scale-125" />
                <span>Learn Our Story</span>
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
