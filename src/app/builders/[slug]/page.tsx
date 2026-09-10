import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowUpRight, Check, Code2 } from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/builders/builder-reveal'
import { StructuredData } from '@/components/seo/structured-data'
import { ProjectFlow } from '@/components/builders/project-flow'
import { InsatsObservatory } from '@/components/builders/insats-observatory'
import { builderProjects, getBuilderProject } from '@/lib/builders'
import { generateMetadata as buildMetadata, getBreadcrumbSchema, SITE_URL } from '@/lib/metadata'

type Props = { params: Promise<{ slug: string }> }
export function generateStaticParams() {
  return builderProjects.map(({ slug }) => ({ slug }))
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getBuilderProject((await params).slug)
  if (!project) return {}
  return buildMetadata({
    title: project.seoTitle,
    description: project.description,
    path: `/builders/${project.slug}`,
    image: project.imageSrc,
    keywords: [project.primaryKeyword, ...project.secondaryKeywords],
  })
}

export default async function BuilderProjectPage({ params }: Props) {
  const project = getBuilderProject((await params).slug)
  if (!project) notFound()
  const related = builderProjects.filter((item) => item.slug !== project.slug)
  const path = `/builders/${project.slug}`
  return (
    <div className={`accent-${project.accent}`}>
      <StructuredData
        data={getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Afribit Builders', url: '/builders' },
          { name: project.name, url: path },
        ])}
      />
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: project.title,
          description: project.description,
          url: `${SITE_URL}${path}`,
          dateModified: project.modifiedDate,
          image: `${SITE_URL}${project.imageSrc}`,
          isPartOf: {
            '@type': 'CollectionPage',
            name: 'Afribit Builders',
            url: `${SITE_URL}/builders`,
          },
          about: {
            '@type': 'Project',
            name: project.name,
            description: project.heroDescription,
            parentOrganization: { '@type': 'Organization', name: 'Afribit Africa', url: SITE_URL },
          },
          ...(project.slug === 'insats' ? { citation: 'https://insats.org' } : {}),
        }}
      />
      <section className="builder-detail-hero">
        <Container>
          <Link href="/builders" className="builder-text-link">
            <ArrowLeft size={17} /> Afribit Builders
          </Link>
          <div className="builder-project-meta">
            <span className="builder-kicker">
              Project {project.number} / {project.category}
            </span>
            <span className="builder-stage">{project.stage}</span>
          </div>
          <h1>
            {project.name}
            <span className="builder-period">.</span>
          </h1>
          <p className="builder-lead">{project.heroDescription}</p>
          <ul className="builder-technologies">
            {project.technologies.map((technology) => (
              <li key={technology}>{technology}</li>
            ))}
          </ul>
          {project.slug === 'insats' && (
            <a
              href="https://insats.org"
              target="_blank"
              rel="noopener noreferrer"
              className="builder-credit"
            >
              Economic measurement in collaboration with Insats <ArrowUpRight size={16} />
            </a>
          )}
        </Container>
      </section>
      <Container>
        <figure className="builder-detail-photo">
          <Image
            src={project.imageSrc}
            alt={project.imageAlt}
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          {project.slug === 'afribit-wifi' && (
            <figcaption>Concept illustration for 3 West Satenet Wi-Fi</figcaption>
          )}
        </figure>
      </Container>
      <section className="builder-section">
        <Container>
          <div className="builder-stats">
            {project.stats.map((stat) => (
              <div key={stat.value}>
                <span>{stat.value}</span>
                <p>{stat.label}</p>
              </div>
            ))}
          </div>
          <ProjectFlow project={project} />
        </Container>
      </section>
      {project.slug === 'insats' && (
        <section className="builder-section builder-observatory">
          <Container>
            <div className="builder-section-heading">
              <span className="builder-kicker">With Insats</span>
              <a
                href="https://insats.org"
                target="_blank"
                rel="noopener noreferrer"
                className="builder-text-link"
              >
                Visit Insats <ArrowUpRight size={16} />
              </a>
            </div>
            <h2 className="builder-observatory-title">What can a purchase tell us?</h2>
            <InsatsObservatory />
          </Container>
        </section>
      )}
      <section className="builder-section builder-details">
        <Container className="builder-reading-grid">
          <aside className="builder-project-sidebar">
            <span className="builder-kicker">Inside the project</span>
            <nav aria-label="Project sections">
              {project.sections.map((section, index) => (
                <Link key={section.id} href={`#${section.id}`}>
                  <span className="builder-mono">0{index + 1}</span>
                  {section.eyebrow}
                </Link>
              ))}
            </nav>
            <div className="builder-sidebar-links">
              {project.relatedLinks.map((link) =>
                link.external ? (
                  <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer">
                    {link.label}
                    <ArrowUpRight size={15} />
                  </a>
                ) : (
                  <Link key={link.href} href={link.href}>
                    {link.label}
                    <ArrowUpRight size={15} />
                  </Link>
                ),
              )}
            </div>
          </aside>
          <div className="builder-reading">
            {project.sections.map((section) => (
              <section id={section.id} key={section.id}>
                <Reveal amount={0.08}>
                  <span className="builder-kicker">{section.eyebrow}</span>
                  <h2>{section.title}</h2>
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets && (
                    <ul>
                      {section.bullets.map((bullet) => (
                        <li key={bullet}>
                          <Check size={17} aria-hidden="true" />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              </section>
            ))}
            <div className="builder-outcomes">
              <Code2 size={26} />
              <h2>What we are building toward</h2>
              <ul>
                {project.takeaways.map((takeaway) => (
                  <li key={takeaway}>
                    <Check size={17} aria-hidden="true" />
                    <span>{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>
      <section className="builder-section builder-related">
        <Container>
          <div className="builder-section-heading">
            <h2>Keep exploring.</h2>
            <Link href="/builders" className="builder-text-link">
              All projects <ArrowUpRight size={17} />
            </Link>
          </div>
          <div className="builder-related-grid">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/builders/${item.slug}`}
                className={`accent-${item.accent}`}
              >
                <span className="builder-mono">
                  PROJECT {item.number} / {item.category}
                </span>
                <h3>
                  {item.name}
                  <ArrowUpRight size={22} />
                </h3>
                <p>{item.heroDescription}</p>
              </Link>
            ))}
          </div>
          <div className="builder-detail-cta">
            <p>Have something to contribute?</p>
            <Button asChild>
              <Link href="/contact">
                Talk to the Builders <ArrowUpRight size={17} />
              </Link>
            </Button>
          </div>
        </Container>
      </section>
    </div>
  )
}
