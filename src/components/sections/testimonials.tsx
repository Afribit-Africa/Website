'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { Container } from '@/components/layout/container'

const TESTIMONIALS = [
  {
    quote:
      'Through Afribit, I was able to complete my driving classes. The repayment in sats is very affordable. I can now convert my sats, save some, and spend some within the circular economy — supporting other riders and helping the whole community grow.',
    name: 'Brian',
    role: 'Boda-Boda Rider, Bitcoin Advocate',
  },
  {
    quote:
      'I proudly call myself a Bitcoin-converted soul. Through the Live Great Waste Management group, I began earning in Bitcoin. With the sats I saved, I launched my own fast food business. Bitcoin is truly the best thing that has happened to me.',
    name: 'DaMian Magak',
    role: 'Entrepreneur, Bitcoin Advocate',
  },
  {
    quote:
      'I was the first merchant selling fries, juice, and porridge. Thanks to my Bitcoin earnings, I bought a motorbike and expanded my business. Bitcoin hasn\'t just helped me grow; it has given me the confidence to dream even bigger.',
    name: 'Steph',
    role: 'Food Merchant, Bitcoin Advocate',
  },
  {
    quote:
      'When Afribit introduced Bitcoin to our waste management group, I was immediately hooked. I\'ve been earning and stacking sats regularly. I also joined the Core Bitcoin Classes to deepen my understanding. It\'s about financial freedom.',
    name: 'Glen Omolo',
    role: 'Waste Management, Bitcoin Advocate',
  },
  {
    quote:
      'As part of the Upcycle Queens initiative, I learned how to create beautiful, functional items from materials that would otherwise be thrown away. My creations are now earning me Bitcoin, and I get to contribute to a sustainable future.',
    name: 'Abebo',
    role: 'Upcycle Queen, Bitcoin Advocate',
  },
]

export function Testimonials() {
  const [index, setIndex] = useState(0)
  const prev = () => setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)
  const next = () => setIndex((i) => (i + 1) % TESTIMONIALS.length)
  const t = TESTIMONIALS[index]

  return (
    <section className="py-20 bg-bg-surface/50">
      <Container>
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <Quote className="size-10 text-bitcoin/30 mx-auto mb-6" />
            <blockquote className="font-display text-xl sm:text-2xl font-medium text-foreground leading-relaxed mb-6">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <div>
              <div className="font-semibold text-foreground text-sm">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          </div>

          {/* Dots + arrows */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={prev}
              className="p-2 rounded-lg border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="size-4" />
            </button>
            <div className="flex gap-1.5">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-6 bg-bitcoin' : 'w-1.5 bg-white/20'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="p-2 rounded-lg border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </Container>
    </section>
  )
}
