import type { Metadata } from 'next'
import { CommunityHero } from '@/components/community/community-hero'
import { CommunityFedi } from '@/components/community/community-fedi'
import { CommunitySocial } from '@/components/community/community-social'
import { CommunityCTA } from '@/components/community/community-cta'
import { generateMetadata } from '@/lib/metadata'

export const metadata: Metadata = generateMetadata({
  title: 'Community',
  description: 'Join Kibera\'s Bitcoin community on Fedi, Telegram, and across social media. Learn, earn, and spend Bitcoin with thousands of Kibera residents.',
  path: '/community',
})

export default function CommunityPage() {
  return (
    <>
      <CommunityHero />
      <CommunityFedi />
      <CommunitySocial />
      <CommunityCTA />
    </>
  )
}
