'use client'

import Link from 'next/link'
import { ArrowRight, ChevronDown, Play } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import { TextReveal } from '@/components/ui/text-reveal'
import { fadeInUp, staggerContainer } from '@/lib/motion'

export function HeroSection() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <section className="relative min-h-[100svh] overflow-hidden bg-bg-base">
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
        <motion.div
          className="max-w-[42rem] py-28 md:py-32 lg:py-36"
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.12, 0.1)}
        >
          <div className="flex flex-col gap-7 md:gap-8">
            <motion.div variants={fadeInUp}>
              <Badge variant="default" className="w-fit gap-1.5 px-3 py-1 text-xs">
                <span className="size-1.5 rounded-full bg-bitcoin animate-pulse" />
                Strategic change in Kibera, Nairobi
              </Badge>
            </motion.div>

            <h1 className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl leading-[1.08]">
              {shouldReduceMotion ? (
                <>
                  Advancing urgent{' '}
                  <span className="text-bitcoin relative inline-block">
                    change
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-bitcoin/30" />
                  </span>{' '}
                  through Bitcoin
                </>
              ) : (
                <>
                  <TextReveal text="Advancing urgent" />{' '}
                  <span className="text-bitcoin relative inline-block">
                    <TextReveal text="change" staggerDelay={0.06} />
                    <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-bitcoin/30" />
                  </span>{' '}
                  <TextReveal text="through Bitcoin" staggerDelay={0.06} />
                </>
              )}
            </h1>

            <motion.p
              variants={fadeInUp}
              className="max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
            >
              Afribit challenges inequitable systems by directing time, talent, treasure, and trusted
              networks toward community-led solutions that address root causes, advance social justice,
              and unlock shared joy in Kibera.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-start gap-4 sm:flex-row sm:items-center"
            >
              <Button asChild size="xl" className="w-full sm:w-auto">
                <Link href="/donate">
                  <span>Fuel Strategic Change</span>
                  <ArrowRight className="size-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline" className="w-full sm:w-auto">
                <Link href="https://www.afribit.africa/about" target="_blank" rel="noreferrer">
                  <Play className="size-4 transition-transform duration-300 group-hover:scale-125" />
                  <span>Learn Our Story</span>
                </Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Container>

      {!shouldReduceMotion && (
        <motion.div
          className="absolute inset-x-0 bottom-6 z-10 hidden justify-center sm:flex"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          aria-hidden
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >
            <ChevronDown className="size-6 text-white/50" />
          </motion.div>
        </motion.div>
      )}
    </section>
  )
}
