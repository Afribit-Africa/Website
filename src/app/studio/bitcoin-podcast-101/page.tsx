import { EducationStudio } from '@/components/education/education-studio'
import { redirect } from 'next/navigation'
import { StructuredData } from '@/components/seo/structured-data'
import { bitcoinLesson, type EducationMedia } from '@/lib/education'
import { generateMetadata, getBreadcrumbSchema, SITE_URL } from '@/lib/metadata'
import media from '../../../../public/education/bitcoin-101-transcript.json'

export const metadata = generateMetadata({
  title: 'Bitcoin Podcast 101 | Afribit Studio',
  description: 'Listen and read along with Bitcoin Podcast 101. Learn Bitcoin fundamentals with synchronized narration, chapter navigation and the complete searchable English transcript.',
  path: bitcoinLesson.href, image: bitcoinLesson.artwork,
  keywords: ['Bitcoin Podcast 101', 'Bitcoin education Kenya', 'Bitcoin audiobook', 'Bitcoin for beginners', 'Afribit Studio'],
})

export default async function LessonPage({ searchParams }: { searchParams: Promise<{ view?: string | string[] }> }) {
  const { view } = await searchParams
  if (view === 'read') redirect(bitcoinLesson.credits.content.href)
  const lessonMedia: EducationMedia = media
  return <>
    <StructuredData data={getBreadcrumbSchema([{ name: 'Home', url: '/' }, { name: 'Afribit Studio', url: '/studio' }, { name: bitcoinLesson.title, url: bitcoinLesson.href }])} />
    <StructuredData data={{
      '@context': 'https://schema.org', '@type': 'LearningResource', name: bitcoinLesson.title,
      description: bitcoinLesson.description, url: `${SITE_URL}${bitcoinLesson.href}`, image: `${SITE_URL}${bitcoinLesson.artwork}`,
      learningResourceType: 'Audio lesson', educationalLevel: 'Beginner', inLanguage: 'en', isAccessibleForFree: true,
      teaches: ['Bitcoin fundamentals', 'Peer-to-peer money', 'Cryptographic verification'],
      provider: { '@type': 'Organization', name: 'Afribit Africa', url: SITE_URL },
      creditText: `Learning content: ${bitcoinLesson.credits.content.name}. AI-generated audio: ${bitcoinLesson.credits.audio.name}.`,
      isBasedOn: { '@type': 'WebPage', name: bitcoinLesson.credits.content.name, url: bitcoinLesson.credits.content.href },
      associatedMedia: { '@type': 'AudioObject', name: bitcoinLesson.subtitle, contentUrl: `${SITE_URL}${bitcoinLesson.audio}`,
        encodingFormat: 'audio/mpeg', duration: `PT${Math.floor(lessonMedia.duration / 60)}M${Math.floor(lessonMedia.duration % 60)}S`, inLanguage: 'en',
        creditText: `AI-generated audio created with ${bitcoinLesson.credits.audio.name}.` },
    }} />
    <EducationStudio media={lessonMedia} />
    <noscript><div style={{ padding: '24px', color: '#f0f2ee', background: '#101211' }}><h2>{bitcoinLesson.title}</h2><p>{bitcoinLesson.description}</p><audio controls preload="metadata" src={bitcoinLesson.audio}><track src={bitcoinLesson.captions} kind="captions" srcLang="en" label="English" /></audio></div></noscript>
  </>
}
