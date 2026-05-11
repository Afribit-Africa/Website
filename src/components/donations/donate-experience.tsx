'use client'

import Image from 'next/image'
import { useState, useTransition } from 'react'
import { ArrowRight, CheckCircle2, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CometCard } from '@/components/ui/comet-card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DonationTier } from '@/lib/donation-tiers'

interface DonateExperienceProps {
  tiers: DonationTier[]
}

export function DonateExperience({ tiers }: DonateExperienceProps) {
  const [selectedTierId, setSelectedTierId] = useState(tiers[0]?.id ?? '')
  const [amount, setAmount] = useState<number | ''>(tiers[0]?.defaultAmount ?? '')
  const [currency, setCurrency] = useState('USD')
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const selectedTier = tiers.find((tier) => tier.id === selectedTierId) ?? tiers[0]

  const fieldClassName =
    'w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-foreground outline-none transition-all duration-300 placeholder:text-white/28 hover:border-white/20 focus:border-bitcoin/70 focus:bg-black/35'

  const toggleButtonClassName =
    'inline-flex items-center justify-center rounded-[0.95rem] px-5 py-2 text-sm font-semibold transition-all duration-300'

  const selectTier = (tier: DonationTier) => {
    setSelectedTierId(tier.id)
    setAmount(tier.defaultAmount ?? '')
    setError(null)
  }

  const handleSubmit = () => {
    startTransition(async () => {
      setError(null)

      if (amount === '' || Number(amount) <= 0) {
        setError('Enter a donation amount before continuing.')
        return
      }

      const tierMessage = message.trim()
        ? `[${selectedTier.name}] ${message.trim()}`
        : `[${selectedTier.name}] Donor selected this support tier.`

      try {
        const response = await fetch('/api/donations/create-invoice', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            amount: Number(amount),
            currency,
            donorName: isAnonymous ? undefined : donorName || undefined,
            donorEmail: isAnonymous ? undefined : donorEmail || undefined,
            program: selectedTier.linkedProgramSlug,
            message: tierMessage,
            isAnonymous,
          }),
        })

        const payload = await response.json()

        if (!response.ok || !payload?.success || !payload?.data?.checkoutLink) {
          if (response.status === 422 && payload?.crowdfundUrl) {
            window.location.href = payload.crowdfundUrl
            return
          }
          setError(payload?.error || payload?.message || 'Unable to start the donation checkout.')
          return
        }

        window.location.href = payload.data.checkoutLink
      } catch {
        setError('Unable to connect to the donation service right now. Please try again.')
      }
    })
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr] xl:items-start">
      <div>
        <div className="grid gap-5 md:grid-cols-2">
          {tiers.map((tier) => {
            const isSelected = tier.id === selectedTierId

            return (
              <button
                key={tier.id}
                type="button"
                onClick={() => selectTier(tier)}
                className="text-left"
              >
                <CometCard
                  className={isSelected ? 'ring-2 ring-bitcoin/70' : 'ring-1 ring-transparent'}
                >
                  <div className="relative min-h-[320px] overflow-hidden rounded-[1.55rem] p-2 md:p-3">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-[1.15rem]">
                      <Image
                        src={tier.imageSrc}
                        alt={tier.imageAlt}
                        fill
                        className="object-cover brightness-[0.72] contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-black/35" />
                      <div className={`absolute inset-0 bg-gradient-to-t ${tier.accentClassName}`} />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/68 to-black/38" />
                      <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                        <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
                          {tier.label}
                        </span>
                        {isSelected ? (
                          <span className="inline-flex size-8 items-center justify-center rounded-full bg-bitcoin text-black">
                            <CheckCircle2 className="size-4" />
                          </span>
                        ) : null}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/95">
                          {tier.amountLabel}
                        </p>
                        <h3 className="mt-2 font-display text-2xl font-bold text-white">{tier.name}</h3>
                        <p className="mt-3 text-sm leading-6 text-white/80">{tier.summary}</p>
                        {tier.goalLabel ? (
                          <p className="mt-3 text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                            {tier.goalLabel}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </CometCard>
              </button>
            )
          })}
        </div>
      </div>

      <div className="xl:sticky xl:top-24">
        <div className="rounded-[2rem] border border-white/10 bg-bg-surface/90 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">
            Complete your gift
          </p>
          <h3 className="mt-3 font-display text-3xl font-bold text-foreground">
            {selectedTier.name}
          </h3>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            {selectedTier.description}
          </p>
          <p className="mt-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm leading-7 text-foreground/85">
            {selectedTier.recognition}
          </p>

          <div className="mt-6 grid gap-4">
            <div className="rounded-[1.5rem] border border-white/8 bg-white/[0.02] p-4 transition-colors hover:border-white/15">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  Donation amount
                </span>
                <div className="grid grid-cols-[1fr_auto] gap-3">
                  <input
                    type="number"
                    min="1"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value === '' ? '' : Number(event.target.value))}
                    className={`${fieldClassName} h-12`}
                    placeholder="Enter amount"
                  />
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger
                      aria-label="Donation currency"
                      className="h-12 min-w-[108px] rounded-2xl border-bitcoin/55 bg-black/35 px-4 text-base font-semibold text-foreground shadow-none hover:border-bitcoin focus-visible:ring-bitcoin/30"
                    >
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border border-white/10 bg-[#121513] text-foreground shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
                      <SelectItem
                        value="USD"
                        className="rounded-xl px-3 py-3 text-sm font-semibold focus:bg-bitcoin/10 focus:text-foreground data-[state=checked]:bg-bitcoin/14 data-[state=checked]:text-bitcoin"
                      >
                        USD
                      </SelectItem>
                      <SelectItem
                        value="BTC"
                        className="rounded-xl px-3 py-3 text-sm font-semibold focus:bg-bitcoin/10 focus:text-foreground data-[state=checked]:bg-bitcoin/14 data-[state=checked]:text-bitcoin"
                      >
                        BTC
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </label>
            </div>

            <div className="grid gap-4 rounded-[1.5rem] border border-white/8 bg-white/[0.02] p-4 transition-colors hover:border-white/15">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  Name
                </span>
                <input
                  type="text"
                  value={donorName}
                  onChange={(event) => setDonorName(event.target.value)}
                  disabled={isAnonymous}
                  className={`${fieldClassName} h-12 disabled:opacity-40`}
                  placeholder="Your name"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  Email for updates or receipt
                </span>
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(event) => setDonorEmail(event.target.value)}
                  disabled={isAnonymous}
                  className={`${fieldClassName} h-12 disabled:opacity-40`}
                  placeholder="you@example.com"
                />
              </label>

              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  Message
                </span>
                <textarea
                  rows={4}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className={`${fieldClassName} min-h-28 py-3`}
                  placeholder="Share why this work matters to you"
                />
              </label>

              <div className="rounded-2xl border border-white/8 bg-black/20 px-4 py-4 transition-colors hover:border-white/15">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="lg:max-w-sm">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                      Recognition preference
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Choose whether Afribit should include your details with the checkout request or keep this donation anonymous.
                    </p>
                  </div>
                  <div
                    className="inline-flex w-auto rounded-[1.2rem] border border-white/10 bg-black/35 p-1"
                    role="group"
                    aria-label="Donation visibility"
                  >
                    <button
                      type="button"
                      aria-pressed={!isAnonymous}
                      onClick={() => setIsAnonymous(false)}
                      className={`${toggleButtonClassName} ${
                        !isAnonymous
                          ? 'bg-bitcoin text-black shadow-[0_10px_24px_rgba(247,147,26,0.28)]'
                          : 'text-white/72 hover:bg-white/6 hover:text-foreground'
                      }`}
                    >
                      Share my details
                    </button>
                    <button
                      type="button"
                      aria-pressed={isAnonymous}
                      onClick={() => setIsAnonymous(true)}
                      className={`${toggleButtonClassName} ${
                        isAnonymous
                          ? 'bg-white/12 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                          : 'text-white/72 hover:bg-white/6 hover:text-foreground'
                      }`}
                    >
                      Give anonymously
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            ) : null}

            <Button onClick={handleSubmit} size="xl" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  Creating invoice
                </>
              ) : (
                <>
                  Continue to secure checkout
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}