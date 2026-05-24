import { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://afribit.africa';
export const SITE_NAME = 'Afribit Africa';
export const SITE_DESCRIPTION = 'Afribit advances urgent, strategic change through Bitcoin by challenging inequitable systems, mobilizing collective resources, and backing root-cause solutions led by communities.';
export const DEFAULT_OG_IMAGE = '/opengraph-image.svg';
export const ORGANIZATION_LOGO = `${SITE_URL}/Logo/Full%20logo%20png%20transparent.png`;
export const GOOGLE_SITE_VERIFICATION = process.env.GOOGLE_SITE_VERIFICATION;

export interface SEOConfig {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: 'website' | 'article';
  keywords?: string[];
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  path,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  keywords = [],
  noIndex = false,
}: SEOConfig): Metadata {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${path}`;
  const imageUrl = image.startsWith('http') ? image : `${SITE_URL}${image}`;

  const defaultKeywords = [
    'Bitcoin',
    'Africa',
    'Bitcoin education',
    'financial inclusion',
    'social justice',
    'strategic giving',
    'unrestricted giving',
    'root causes',
    'cryptocurrency',
    'Kenya',
    'Nairobi',
    'Kibera',
    'Bitcoin adoption',
    'blockchain',
    'African development',
  ];

  return {
    title,
    description,
    keywords: [...defaultKeywords, ...keywords].join(', '),
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    robots: noIndex
      ? 'noindex, nofollow'
      : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    alternates: {
      canonical: url,
    },
    openGraph: {
      type,
      locale: 'en_US',
      url,
      siteName: SITE_NAME,
      title: fullTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      site: '@AfribitAfrica',
      creator: '@AfribitAfrica',
      title: fullTitle,
      description,
      images: [imageUrl],
    },
    verification: {
      google: GOOGLE_SITE_VERIFICATION,
    },
  };
}

// JSON-LD Structured Data Helpers

export function getOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    alternateName: 'Afribit',
    url: SITE_URL,
    logo: ORGANIZATION_LOGO,
    description: SITE_DESCRIPTION,
    email: 'connect@afribit.africa',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KE',
      addressRegion: 'Nairobi County',
      addressLocality: 'Nairobi',
    },
    areaServed: [
      {
        '@type': 'Place',
        name: 'Kibera, Nairobi, Kenya',
      },
    ],
    sameAs: [
      'https://x.com/afribitkibera',
      'https://www.instagram.com/afribit_africa/',
      'https://youtube.com/@afribitafrica',
    ],
    foundingDate: '2020',
    founders: [
      {
        '@type': 'Person',
        name: 'Afribit Team',
      },
    ],
  };
}

export function getWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: ORGANIZATION_LOGO,
      },
    },
  };
}

export function getBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function getFAQSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function getDonationSchema(programName: string, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DonateAction',
    recipient: {
      '@type': 'Organization',
      name: SITE_NAME,
    },
    description,
    name: `Donate to ${programName}`,
    url: `${SITE_URL}/donate`,
  };
}

export function getEventSchema(event: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate || event.startDate,
    location: {
      '@type': 'Place',
      name: event.location,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'KE',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
  };
}

export function getArticleSchema(article: {
  title: string;
  description: string;
  publishedDate: string;
  modifiedDate?: string;
  author: string;
  image?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image ? `${SITE_URL}${article.image}` : `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    datePublished: article.publishedDate,
    dateModified: article.modifiedDate || article.publishedDate,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: ORGANIZATION_LOGO,
      },
    },
  };
}
