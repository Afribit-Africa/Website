'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Check, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { FediInvite } from '@/lib/fedi-invites'

type FediInviteCardProps = {
  invite: FediInvite
}

export function FediInviteCard({ invite }: FediInviteCardProps) {
  const [copied, setCopied] = useState(false)
  const resetTimerRef = useRef<number | null>(null)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(invite.code)
      setCopied(true)

      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current)
      }

      resetTimerRef.current = window.setTimeout(() => {
        setCopied(false)
      }, 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="rounded-2xl border border-white/8 bg-bg-surface p-6 flex flex-col items-center gap-4">
      <div className="text-sm font-medium text-foreground text-center">{invite.title}</div>
      <div className="rounded-xl overflow-hidden bg-white p-3">
        <Image
          src={invite.imageSrc}
          alt={invite.imageAlt}
          width={180}
          height={180}
          className="block"
        />
      </div>
      <p className="text-xs text-muted-foreground text-center leading-relaxed">
        {invite.description}
      </p>
      <div className="w-full rounded-xl border border-white/8 bg-black/20 p-3">
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/45">
          Invite code
        </p>
        <code className="block max-h-28 overflow-auto break-all text-left font-mono text-[11px] leading-5 text-foreground/90">
          {invite.code}
        </code>
      </div>
      <div className="flex w-full items-center justify-between gap-3">
        <Button type="button" variant="outline" size="sm" className="min-w-[9.5rem]" onClick={handleCopy}>
          {copied ? <Check className="size-3.5" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
          {copied ? 'Copied' : invite.copyLabel}
        </Button>
        <span className="text-[11px] text-muted-foreground" aria-live="polite">
          {copied ? 'Copied to clipboard' : 'Copy for same-device use'}
        </span>
      </div>
    </div>
  )
}