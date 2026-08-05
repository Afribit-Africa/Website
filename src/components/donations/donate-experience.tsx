'use client'

import { useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Check, Copy, HeartHandshake, QrCode } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DONATION_LIGHTNING_ADDRESS, DONATION_QR_VALUE } from '@/lib/donation-policy'

export function DonateExperience() {
  const [copied, setCopied] = useState(false)

  const copyLightningAddress = async () => {
    try {
      await navigator.clipboard.writeText(DONATION_LIGHTNING_ADDRESS)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="mx-auto grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
      <div className="order-2 lg:order-1">
        <div className="rounded-[2rem] border border-white/10 bg-bg-surface/88 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-8">
          <div className="flex items-center gap-3 text-bitcoin">
            <span className="flex size-11 items-center justify-center rounded-2xl bg-bitcoin/12">
              <HeartHandshake className="size-5" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">
              Donations temporarily static
            </p>
          </div>

          <h2 className="mt-5 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            Scan the Lightning address to donate.
          </h2>
          <p className="mt-4 text-base leading-8 text-muted-foreground">
            Afribit&apos;s BTCPay Server donation checkout is under maintenance while we move it onto our own infrastructure. For now, any supporter can donate with a Lightning wallet by scanning this QR code or copying the address below.
          </p>

          <div className="mt-6 rounded-[1.45rem] border border-bitcoin/20 bg-bitcoin/10 p-4 text-sm leading-7 text-foreground/86">
            The QR code contains only the Afribit Lightning address. Enter any donation amount from your wallet.
          </div>

          <div className="mt-6 rounded-[1.35rem] border border-white/10 bg-black/25 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/50">
              Lightning address
            </p>
            <p className="mt-2 break-all font-display text-2xl font-bold text-foreground">
              {DONATION_LIGHTNING_ADDRESS}
            </p>
          </div>

          <Button
            type="button"
            size="xl"
            className="mt-5 w-full"
            onClick={copyLightningAddress}
          >
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? 'Copied' : 'Copy lightning address'}
          </Button>
        </div>
      </div>

      <div className="order-1 lg:order-2">
        <div className="relative mx-auto max-w-[30rem] rounded-[2.25rem] border border-white/10 bg-[#111412] p-4 shadow-[0_28px_90px_rgba(0,0,0,0.38)]">
          <div className="absolute -right-3 -top-3 flex size-14 items-center justify-center rounded-2xl border border-bitcoin/30 bg-bitcoin text-black shadow-[0_14px_34px_rgba(247,147,26,0.28)]">
            <QrCode className="size-7" />
          </div>
          <div className="rounded-[1.75rem] bg-white p-5">
            <QRCodeSVG
              value={DONATION_QR_VALUE}
              className="h-auto w-full"
              marginSize={2}
              level="M"
              title="Afribit Lightning address QR code"
            />
          </div>
          <div className="px-3 pb-3 pt-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bitcoin/90">
              Afribit Africa
            </p>
            <p className="mt-2 break-all text-sm font-semibold text-foreground">
              {DONATION_LIGHTNING_ADDRESS}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
