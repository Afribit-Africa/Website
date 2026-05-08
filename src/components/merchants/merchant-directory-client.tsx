'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, ExternalLink, MapPinned, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { MerchantProfile } from '@/types'

interface MerchantDirectoryClientProps {
  merchants: MerchantProfile[]
}

function buildOptions(values: Array<string | null | undefined>) {
  return Array.from(new Set(values.filter(Boolean))) as string[]
}

export function MerchantDirectoryClient({ merchants }: MerchantDirectoryClientProps) {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [neighborhood, setNeighborhood] = useState('all')
  const [paymentMethod, setPaymentMethod] = useState('all')

  const categories = useMemo(() => buildOptions(merchants.map((merchant) => merchant.category)), [merchants])
  const neighborhoods = useMemo(
    () => buildOptions(merchants.map((merchant) => merchant.neighborhood)),
    [merchants]
  )
  const paymentMethods = useMemo(
    () => buildOptions(merchants.flatMap((merchant) => merchant.paymentMethods)),
    [merchants]
  )

  const filteredMerchants = useMemo(() => {
    return merchants.filter((merchant) => {
      const query = search.trim().toLowerCase()
      const matchesSearch =
        !query ||
        [merchant.name, merchant.summary, merchant.category, merchant.neighborhood, merchant.city]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query))

      const matchesCategory = category === 'all' || merchant.category === category
      const matchesNeighborhood = neighborhood === 'all' || merchant.neighborhood === neighborhood
      const matchesPaymentMethod =
        paymentMethod === 'all' ||
        merchant.paymentMethods.some((method) => method.toLowerCase() === paymentMethod.toLowerCase())

      return matchesSearch && matchesCategory && matchesNeighborhood && matchesPaymentMethod
    })
  }, [merchants, search, category, neighborhood, paymentMethod])

  const resetFilters = () => {
    setSearch('')
    setCategory('all')
    setNeighborhood('all')
    setPaymentMethod('all')
  }

  return (
    <Tabs defaultValue="list" className="gap-6">
      <div className="rounded-[1.75rem] border border-white/8 bg-bg-surface/80 p-4 shadow-[0_20px_60px_rgba(0,0,0,0.18)] md:p-5">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_auto] lg:items-end">
          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              Search merchants
            </span>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/35" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by name, category, or neighborhood"
                className="h-11 border-white/10 bg-black/20 pl-10 hover:border-white/20 focus-visible:border-bitcoin/70 focus-visible:ring-bitcoin/30"
              />
            </div>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              Category
            </span>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="h-11 w-full border-white/10 bg-black/20 hover:border-white/20 focus-visible:border-bitcoin/70">
                <SelectValue placeholder="All categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {categories.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              Neighborhood
            </span>
            <Select value={neighborhood} onValueChange={setNeighborhood}>
              <SelectTrigger className="h-11 w-full border-white/10 bg-black/20 hover:border-white/20 focus-visible:border-bitcoin/70">
                <SelectValue placeholder="All neighborhoods" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All neighborhoods</SelectItem>
                {neighborhoods.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <label className="grid gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-white/45">
              Payment method
            </span>
            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
              <SelectTrigger className="h-11 w-full border-white/10 bg-black/20 hover:border-white/20 focus-visible:border-bitcoin/70">
                <SelectValue placeholder="Any method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any method</SelectItem>
                {paymentMethods.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </label>

          <Button variant="outline" className="h-11 border-white/10 bg-black/20" onClick={resetFilters}>
            Reset
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">
            {filteredMerchants.length} merchant{filteredMerchants.length === 1 ? '' : 's'} shown
          </p>
        </div>
        <TabsList variant="default" className="bg-white/[0.04] p-1">
          <TabsTrigger value="list">List view</TabsTrigger>
          <TabsTrigger value="map">Map view</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="list" className="space-y-5">
        {filteredMerchants.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-white/12 bg-bg-surface/60 p-10 text-center">
            <h3 className="font-display text-2xl font-bold text-foreground">No merchants matched these filters.</h3>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
              Adjust the search term or reset the sector, neighborhood, and payment filters to widen the results.
            </p>
            <Button variant="outline" className="mt-6 border-white/10 bg-black/20" onClick={resetFilters}>
              Reset filters
            </Button>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredMerchants.map((merchant) => (
              <CardSpotlight key={merchant.slug} className="h-full overflow-hidden border-white/8 bg-bg-surface/90 p-0">
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={merchant.image || '/Images/Mama mboga groceries accepting bitcoin.jpg'}
                    alt={merchant.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                    <Badge variant={merchant.featured ? 'default' : 'secondary'}>
                      {merchant.featured ? 'Featured' : merchant.category}
                    </Badge>
                    {merchant.acceptsBitcoin ? (
                      <Badge variant="green">Accepts Bitcoin</Badge>
                    ) : null}
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">
                      {merchant.neighborhood || merchant.locationLabel || 'Kibera'}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-bold text-white">{merchant.name}</h3>
                  </div>
                </div>

                <div className="p-5">
                  <p className="text-sm leading-7 text-muted-foreground">{merchant.summary}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {merchant.paymentMethods.slice(0, 3).map((method) => (
                      <span
                        key={method}
                        className="rounded-full border border-white/8 bg-white/[0.03] px-3 py-1 text-xs font-medium text-white/75"
                      >
                        {method}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-white/45">Location</p>
                      <p className="mt-1 text-sm text-foreground/85">
                        {[merchant.neighborhood, merchant.city].filter(Boolean).join(', ') || merchant.country || 'Kibera, Nairobi'}
                      </p>
                    </div>
                    <Button asChild variant="outline" className="border-white/10 bg-black/20">
                      <Link href={`/merchants/${merchant.slug}`}>
                        View profile
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardSpotlight>
            ))}
          </div>
        )}
      </TabsContent>

      <TabsContent value="map">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-[#121513] p-4 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="relative min-h-[420px] overflow-hidden rounded-[1.5rem]">
              <Image
                src="/Images/Kibera Aerial view.jpg"
                alt="Approximate view of Kibera neighborhoods"
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/15" />
              <div className="absolute inset-x-5 bottom-5 rounded-[1.5rem] border border-white/12 bg-black/35 p-5 backdrop-blur-md">
                <div className="flex items-center gap-3 text-bitcoin">
                  <MapPinned className="size-5" />
                  <span className="text-sm font-semibold uppercase tracking-[0.18em]">Map view</span>
                </div>
                <p className="mt-3 text-sm leading-7 text-white/82">
                  Merchant discovery is neighborhood-led for now. Exact public pin placement should follow the privacy rules for each business, so this map view stays approximate while the directory remains fully usable in list view.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/8 bg-bg-surface/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-bitcoin/90">
              Map companions
            </p>
            <h3 className="mt-3 font-display text-2xl font-bold text-foreground">
              Explore the wider Bitcoin merchant ecosystem
            </h3>
            <p className="mt-4 text-sm leading-7 text-muted-foreground">
              Use the Afribit directory for curated local context, then jump into BTC Map for the broader community view and external discovery tools.
            </p>
            <div className="mt-6 grid gap-3">
              <a
                href="https://btcmap.org/community/afribit-kibera"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground transition-colors hover:border-bitcoin/40"
              >
                View on BTC Map
                <ExternalLink className="size-4 text-bitcoin" />
              </a>
              <Link
                href="https://www.afribit.africa/register"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-foreground transition-colors hover:border-bitcoin/40"
              >
                Register your business
                <ArrowRight className="size-4 text-bitcoin" />
              </Link>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  )
}