import { MetadataRoute } from 'next';
import { programs } from '@/lib/programs';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afribit.africa';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const programRoutes = programs.map((program) => ({
    url: `${SITE_URL}/programs/${program.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/donate`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/programs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    ...programRoutes,
  ];
}
