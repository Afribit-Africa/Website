'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, createScope, stagger } from 'animejs'
import { useReducedMotion } from 'framer-motion'
import {
  ArrowRight,
  CheckCheck,
  Fingerprint,
  ScanLine,
  Wallet,
  Wifi,
  Router,
  CreditCard,
  Smartphone,
  ClipboardList,
  BadgeCheck,
  ChartNoAxesCombined,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import type { BuilderProject } from '@/lib/builders'

const flowIcons = {
  'taka-sats': [Fingerprint, ScanLine, CheckCheck, Wallet],
  'afribit-wifi': [Wifi, Smartphone, CreditCard, Router],
  insats: [Wallet, ClipboardList, BadgeCheck, ChartNoAxesCombined],
}

export function ProjectFlow({
  project,
}: {
  project: Pick<BuilderProject, 'slug' | 'name' | 'flow' | 'accent'>
}) {
  const [step, setStep] = useState('0')
  const root = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const icons = flowIcons[project.slug as keyof typeof flowIcons]

  useEffect(() => {
    if (reduced !== false) return
    const scope = createScope({ root }).add(() => {
      animate('[data-flow-line]', { scaleX: [0, 1], duration: 650, ease: 'out(3)' })
      animate('[data-flow-detail]', {
        opacity: [0, 1],
        y: [10, 0],
        delay: stagger(70),
        duration: 450,
        ease: 'out(3)',
      })
    })
    return () => scope.revert()
  }, [step, reduced])

  return (
    <div ref={root} className={`builder-flow accent-${project.accent}`}>
      <div className="builder-tool-heading">
        <span className="builder-kicker">The {project.name} journey</span>
        <span className="builder-mono">0{Number(step) + 1} / 04</span>
      </div>
      <Tabs value={step} onValueChange={setStep}>
        <TabsList className="builder-flow-tabs" aria-label={`${project.name} workflow`}>
          {project.flow.map((item, index) => {
            const Icon = icons[index]
            return (
              <TabsTrigger key={item.title} value={String(index)} className="builder-flow-tab">
                <Icon aria-hidden="true" />
                <span>{item.title}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>
        <div className="builder-flow-track" aria-hidden="true">
          <div data-flow-line style={{ width: `${(Number(step) + 1) * 25}%` }} />
        </div>
        {project.flow.map((item, index) => {
          const Icon = icons[index]
          return (
            <TabsContent key={item.title} value={String(index)} className="builder-flow-content">
              <Icon data-flow-detail className="builder-flow-icon" aria-hidden="true" />
              <div>
                <h3 data-flow-detail>{item.title}</h3>
                <p data-flow-detail>{item.detail}</p>
              </div>
              <button
                className="builder-icon-button"
                type="button"
                title={index === 3 ? 'Return to first step' : 'Next step'}
                aria-label={index === 3 ? 'Return to first step' : 'Next step'}
                onClick={() => setStep(String((index + 1) % 4))}
              >
                <ArrowRight aria-hidden="true" />
              </button>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
