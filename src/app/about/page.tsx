import type { Metadata } from 'next'
import { AboutHero } from '@/components/about/about-hero'
import { AboutVideo } from '@/components/about/about-video'
import { MissionVision } from '@/components/about/mission-vision'
import { OurStory } from '@/components/about/our-story'
import { CoreValues } from '@/components/about/core-values'
import { AboutCTA } from '@/components/about/about-cta'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'About',
  description:
    'Afribit is a grassroots organisation building a Bitcoin circular economy in Kibera, Nairobi — empowering unbanked communities through Bitcoin education, merchant adoption, and the Lightning Network.',
  path: '/about',
})

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <AboutVideo />
      <MissionVision />
      <OurStory />
      <CoreValues />
      <AboutCTA />
    </>
  )
}
