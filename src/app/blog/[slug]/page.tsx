import { notFound, permanentRedirect } from 'next/navigation'
import { builderProjects } from '@/lib/builders'

export function generateStaticParams() {
  return builderProjects.map((project) => ({ slug: project.legacySlug }))
}

export default async function FormerArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = builderProjects.find((item) => item.legacySlug === slug)
  if (!project) notFound()
  permanentRedirect(`/builders/${project.slug}`)
}
