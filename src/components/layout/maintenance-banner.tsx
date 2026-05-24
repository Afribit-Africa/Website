'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const NOTICE_ROUTE = '/merchants/location-accuracy'
const MARQUEE_REPEATS = 4

function NoticeStrip({ hidden = false }: { hidden?: boolean }) {
  return (
    <div
      aria-hidden={hidden}
      className="flex items-center gap-[var(--gap)]"
    >
      <span className="font-semibold text-bitcoin">Merchant map notice</span>
      <span className="text-foreground/90">
        Some BTC Map GPS points are still being refined.
      </span>
      <span className="text-muted-foreground">
        Afribit&apos;s listed businesses are authentic, but exact pins can be off in dense market areas or on low-accuracy devices.
      </span>
    </div>
  )
}

export function MaintenanceBanner() {
  return (
    <div role="banner" className="border-b border-bitcoin/20 bg-bg-base/95 text-sm backdrop-blur-md">
      <div className="hidden flex-wrap items-start gap-3 px-4 py-2.5 sm:px-6 motion-reduce:flex">
        <span className="mt-1 size-1.5 shrink-0 rounded-full bg-bitcoin" aria-hidden="true" />
        <p className="min-w-0 flex-1 text-foreground/90 leading-snug">
          <span className="font-semibold text-bitcoin">Merchant map notice</span>
          {' '}Some BTC Map GPS points are still being refined. Afribit&apos;s listed businesses are authentic, but exact pins can be off in dense market areas or on low-accuracy devices.
        </p>
        <Link
          href={NOTICE_ROUTE}
          className="inline-flex shrink-0 items-center gap-1 font-semibold text-bitcoin underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Read more
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </div>

      <div className="group flex flex-wrap items-center gap-3 px-4 py-2.5 sm:flex-nowrap sm:px-6 motion-reduce:hidden">
        <span className="size-1.5 shrink-0 rounded-full bg-bitcoin animate-pulse" aria-hidden="true" />
        <div className="min-w-0 flex-1 overflow-hidden [--gap:2rem]">
          <div className="flex w-full gap-[var(--gap)] overflow-hidden whitespace-nowrap [--duration:60s] group-hover:[--duration:96s]">
            {Array.from({ length: MARQUEE_REPEATS }).map((_, index) => (
              <div
                key={index}
                className="flex shrink-0 items-center justify-around gap-[var(--gap)] motion-safe:animate-marquee"
              >
                <NoticeStrip hidden={index > 0} />
              </div>
            ))}
          </div>
        </div>
        <Link
          href={NOTICE_ROUTE}
          className="inline-flex shrink-0 items-center gap-1 font-semibold text-bitcoin underline underline-offset-2 hover:opacity-80 transition-opacity"
        >
          Read more
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
