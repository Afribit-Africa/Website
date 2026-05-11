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
import {
  CROWDFUND_URL,
  DONATION_INPUT_PLACEHOLDERS,
  DONATION_INPUT_STEPS,
  getDonationAmountHelperText,
  getDonationMinimumMessage,
  isBelowDonationMinimum,
  normalizeDonationAmount,
  type DonationCurrency,
} from '@/lib/donation-policy'

interface DonateExperienceProps {
  tiers: DonationTier[]
}

export function DonateExperience({ tiers }: DonateExperienceProps) {
  const [selectedTierId, setSelectedTierId] = useState(tiers[0]?.id ?? '')
  const [currency, setCurrency] = useState<DonationCurrency>('USD')
  const [amountByCurrency, setAmountByCurrency] = useState<Record<DonationCurrency, number | ''>>({
    USD: tiers[0]?.defaultAmount ?? '',
    BTC: '',
  })
  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const selectedTier = tiers.find((tier) => tier.id === selectedTierId) ?? tiers[0]
  const isFixedTier = selectedTier.isFixedAmount && typeof selectedTier.defaultAmount === 'number'
  const amount = isFixedTier ? selectedTier.defaultAmount : amountByCurrency[currency]

  const fieldClassName =
    'w-full rounded-2xl border border-white/10 bg-black/25 px-4 text-foreground outline-none transition-all duration-300 placeholder:text-white/28 hover:border-white/20 focus:border-bitcoin/70 focus:bg-black/35'

  const toggleButtonClassName =
    'inline-flex min-h-14 items-center justify-center rounded-[1.1rem] px-4 py-3 text-sm font-semibold text-left transition-all duration-300'

  const selectTier = (tier: DonationTier) => {
    setSelectedTierId(tier.id)
    setAmountByCurrency((currentAmounts) => ({
      ...currentAmounts,
      USD: tier.defaultAmount ?? currentAmounts.USD,
    }))
    if (tier.isFixedAmount) {
      setCurrency('USD')
    }
    setError(null)
  }

  const handleCurrencyChange = (nextCurrency: string) => {
    if (isFixedTier) {
      return
    }

    const donationCurrency = nextCurrency as DonationCurrency

    setCurrency(donationCurrency)
    setError(null)

    if (donationCurrency === 'USD' && amountByCurrency.USD === '' && selectedTier.defaultAmount) {
      setAmountByCurrency((currentAmounts) => ({
        ...currentAmounts,
        USD: selectedTier.defaultAmount ?? currentAmounts.USD,
      }))
    }
  }

  const updateAmount = (nextAmount: number | '') => {
    if (isFixedTier) {
      return
    }

    setAmountByCurrency((currentAmounts) => ({
      ...currentAmounts,
      [currency]: nextAmount,
    }))
  }

  const handleSubmit = () => {
    startTransition(async () => {
      setError(null)

      if (amount === '' || Number(amount) <= 0) {
        setError('Enter a donation amount before continuing.')
        return
      }

      const normalizedAmount = normalizeDonationAmount(Number(amount), currency)

      if (isBelowDonationMinimum(normalizedAmount, currency)) {
        setError(`${getDonationMinimumMessage(currency)} You can also donate through the Afribit crowdfund.`)
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
            amount: normalizedAmount,
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
          const errorMessage = payload?.message || payload?.error || 'Unable to start the donation checkout.'
          setError(payload?.crowdfundUrl ? `${errorMessage} Use the Afribit crowdfund if you prefer.` : errorMessage)
          return
        }

        window.location.href = payload.data.checkoutLink
      } catch {
        setError('Unable to connect to the donation service right now. Please try again.')
      }
    })
  }

  return (
    <div className="grid gap-10 xl:grid-cols-[1.12fr_0.88fr] xl:items-start">
      <div>
        <div className="grid gap-6 md:grid-cols-2">
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
                  <div className="relative min-h-[360px] overflow-hidden rounded-[1.55rem] p-4 sm:min-h-[390px]">
                    <Image
                      src={tier.imageSrc}
                      alt={tier.imageAlt}
                      fill
                      className="object-cover brightness-[0.72] contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-black/35" />
                    <div className={`absolute inset-0 bg-gradient-to-t ${tier.accentClassName}`} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/72 to-black/34" />
                    <div className="absolute inset-x-4 top-4 flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
                          {tier.label}
                        </span>
                        {tier.isFixedAmount ? (
                          <span className="rounded-full border border-bitcoin/30 bg-bitcoin/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-bitcoin backdrop-blur-sm">
                            Fixed gift
                          </span>
                        ) : null}
                      </div>
                      {isSelected ? (
                        <span className="inline-flex size-8 items-center justify-center rounded-full bg-bitcoin text-black">
                          <CheckCircle2 className="size-4" />
                        </span>
                      ) : null}
                    </div>
                    <div className="absolute inset-x-4 bottom-4 flex flex-col gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/95">
                        {tier.amountLabel}
                      </p>
                      <h3 className="font-display text-[1.8rem] font-bold leading-tight text-white">{tier.name}</h3>
                      <p className="max-w-[30rem] text-sm leading-6 text-white/82">{tier.summary}</p>
                      {tier.goalLabel ? (
                        <p className="text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                          {tier.goalLabel}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </CometCard>
              </button>
            )
          })}
        </div>
      </div>

      <div className="xl:sticky xl:top-32">
        <div className="rounded-[2rem] border border-white/10 bg-bg-surface/90 p-6 shadow-[0_24px_60px_rgba(0,0,0,0.28)] backdrop-blur-xl md:p-7 lg:p-8">
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

          <div className="mt-6 grid gap-5">
            <div className="rounded-[1.65rem] border border-white/8 bg-white/[0.02] p-5 transition-colors hover:border-white/15">
              <label className="grid gap-2">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                  Donation amount
                </span>
                <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input
                    type="number"
                    min={currency === 'BTC' ? '0.00000001' : '1'}
                    step={DONATION_INPUT_STEPS[currency]}
                    value={amount}
                    onChange={(event) => updateAmount(event.target.value === '' ? '' : Number(event.target.value))}
                    disabled={isFixedTier}
                    className={`${fieldClassName} h-12 disabled:cursor-not-allowed disabled:opacity-75`}
                    placeholder={DONATION_INPUT_PLACEHOLDERS[currency]}
                  />
                  <Select value={currency} onValueChange={handleCurrencyChange} disabled={isFixedTier}>
                    <SelectTrigger
                      aria-label="Donation currency"
                      className="h-12 min-w-[108px] rounded-2xl border-bitcoin/55 bg-black/35 px-4 text-base font-semibold text-foreground shadow-none hover:border-bitcoin focus-visible:ring-bitcoin/30 disabled:cursor-not-allowed disabled:opacity-75"
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
                <span className="text-sm leading-6 text-muted-foreground">
                  {isFixedTier
                    ? `This program gift is fixed at $${selectedTier.defaultAmount}. BTCPay lets you complete the checkout with Bitcoin or Lightning.`
                    : getDonationAmountHelperText(currency)}
                </span>
              </label>
            </div>

            <div className="grid gap-5 rounded-[1.65rem] border border-white/8 bg-white/[0.02] p-5 transition-colors hover:border-white/15 md:p-6">
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

              <div className="rounded-[1.45rem] border border-white/8 bg-black/20 p-4 transition-colors hover:border-white/15 md:p-5">
                <div className="grid gap-4">
                  <div className="max-w-xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
                      Recognition preference
                    </p>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      Choose whether Afribit should include your details with the checkout request or keep this donation anonymous.
                    </p>
                  </div>
                  <div
                    className="grid gap-3 sm:grid-cols-2"
                    role="group"
                    aria-label="Donation visibility"
                  >
                    <button
                      type="button"
                      aria-pressed={!isAnonymous}
                      onClick={() => setIsAnonymous(false)}
                      className={`${toggleButtonClassName} ${
                        !isAnonymous
                          ? 'border border-bitcoin/30 bg-bitcoin text-black shadow-[0_10px_24px_rgba(247,147,26,0.28)]'
                          : 'border border-white/10 bg-black/35 text-white/72 hover:bg-white/6 hover:text-foreground'
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-semibold">Share my details</span>
                        <span className="mt-1 block text-xs font-normal leading-5 opacity-80">
                          For updates, thanks, and donor recognition.
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      aria-pressed={isAnonymous}
                      onClick={() => setIsAnonymous(true)}
                      className={`${toggleButtonClassName} ${
                        isAnonymous
                          ? 'border border-white/16 bg-white/12 text-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                          : 'border border-white/10 bg-black/35 text-white/72 hover:bg-white/6 hover:text-foreground'
                      }`}
                    >
                      <span>
                        <span className="block text-sm font-semibold">Give anonymously</span>
                        <span className="mt-1 block text-xs font-normal leading-5 opacity-80">
                          Keep this gift private during checkout.
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {error ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
                <div className="mt-2">
                  <a href={CROWDFUND_URL} target="_blank" rel="noreferrer" className="font-semibold text-bitcoin hover:underline">
                    Open the Afribit crowdfund instead
                  </a>
                </div>
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