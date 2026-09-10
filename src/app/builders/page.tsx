import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowDown,
  ArrowUpRight,
  Code2,
  GitBranch,
  MapPin,
  Recycle,
  Radio,
  ChartNoAxesCombined,
  Users,
  Fingerprint,
  HeartHandshake,
} from 'lucide-react'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/builders/builder-reveal'
import { StructuredData } from '@/components/seo/structured-data'
import { BuildersMotion } from '@/components/builders/builders-motion'
import { InsatsObservatory } from '@/components/builders/insats-observatory'
import { builderProjects } from '@/lib/builders'
import { generateMetadata, getBreadcrumbSchema, SITE_URL } from '@/lib/metadata'

export const metadata = generateMetadata({
  title: 'Afribit Builders | Community Bitcoin Projects',
  description:
    'Meet Afribit Builders, the team building Bitcoin tools for community life in Kibera: Taka Sats recycling rewards, Afribit Wi-Fi, and price intelligence with Insats.',
  path: '/builders',
  image: '/Images/Kibera Aerial view.jpg',
  keywords: [
    'Afribit Builders',
    'Bitcoin developers Kenya',
    'community technology Kibera',
    'Taka Sats',
    'Afribit Wi-Fi',
    'Insats',
  ],
})

const icons = [Recycle, Radio, ChartNoAxesCombined]
const principles = [
  {
    icon: Users,
    title: 'Build with people.',
    copy: 'Collectors, merchants, and neighbours shape the questions. Their experience shapes the product.',
  },
  {
    icon: Fingerprint,
    title: 'Keep ownership local.',
    copy: 'Merchant-controlled wallets, operator-owned systems, and tools our community can understand.',
  },
  {
    icon: GitBranch,
    title: 'Learn in the field.',
    copy: 'Listen, prototype, test, and improve. Real devices and everyday conditions keep our work grounded.',
  },
  {
    icon: HeartHandshake,
    title: 'Make trust visible.',
    copy: 'Clear records, consent, and careful verification turn technical decisions into accountability.',
  },
]

export default function BuildersPage() {
  return (
    <>
      <StructuredData
        data={getBreadcrumbSchema([
          { name: 'Home', url: '/' },
          { name: 'Afribit Builders', url: '/builders' },
        ])}
      />
      <StructuredData
        data={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: 'Afribit Builders',
          url: `${SITE_URL}/builders`,
          description: metadata.description,
          mainEntity: {
            '@type': 'ItemList',
            itemListElement: builderProjects.map((project, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: project.name,
              url: `${SITE_URL}/builders/${project.slug}`,
            })),
          },
        }}
      />

      <BuildersMotion>
        <section className="builders-hero" aria-labelledby="builders-title">
          <Image
            src="/Images/Kibera Aerial view.jpg"
            alt="An aerial view of Kibera, Nairobi, where Afribit builds community technology"
            fill
            priority
            sizes="100vw"
            className="builders-hero-photo"
          />
          <div className="builders-hero-shade" aria-hidden="true" />
          <div className="builders-hero-grid" data-builder-grid aria-hidden="true" />
          <Container className="builders-hero-inner">
            <div className="builders-hero-top" data-builder-enter>
              <span className="builder-kicker">
                <Code2 size={16} /> People. Purpose. Bitcoin.
              </span>
              <span className="builder-location">
                <MapPin size={14} /> Kibera, Nairobi
              </span>
            </div>
            <div className="builders-hero-copy">
              <h1 id="builders-title">
                <span data-builder-enter>Afribit</span>
                <span data-builder-enter>
                  Builders<span className="builder-period">.</span>
                </span>
              </h1>
              <p data-builder-enter>
                The team behind the tech.
                <br />
                Building for the community we call home.
              </p>
              <div className="builder-actions" data-builder-enter>
                <Button asChild size="lg">
                  <Link href="#projects">
                    Explore the projects <ArrowDown size={17} />
                  </Link>
                </Button>
                <Link href="#team" className="builder-text-link">
                  Meet the Builders <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
            <div className="builders-hero-bottom" data-builder-enter>
              <span>
                <span className="builder-mono">01 / 03</span> Technology with a local heartbeat
              </span>
              <span className="builder-mono">CODE / CONNECT / CREATE</span>
            </div>
          </Container>
        </section>
      </BuildersMotion>

      <nav className="builders-project-rail" aria-label="Builder projects">
        <Container className="builders-rail-inner">
          {builderProjects.map((project, index) => {
            const Icon = icons[index]
            return (
              <Link
                key={project.slug}
                href={`/builders/${project.slug}`}
                className={`accent-${project.accent}`}
              >
                <span className="builder-mono">{project.number}</span>
                <Icon size={21} aria-hidden="true" />
                <span>{project.slug === 'insats' ? 'Afribit x Insats' : project.name}</span>
                <ArrowUpRight size={17} className="rail-arrow" aria-hidden="true" />
              </Link>
            )
          })}
        </Container>
      </nav>

      <section id="team" className="builder-section builder-team">
        <Container>
          <Reveal>
            <div className="builder-section-heading">
              <span className="builder-kicker">The people behind the purpose</span>
              <span className="builder-mono">/ THE BUILDERS</span>
            </div>
          </Reveal>
          <div className="builder-team-grid">
            <Reveal>
              <h2>
                Local roots.
                <br />
                Open minds.
                <br />
                <span>Working technology.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="builder-lead">
                At the heart of Afribit is a group of developers, collaborators, and creators we
                call the Afribit Builders.
              </p>
              <p>
                We turn community needs into tools people can use. From a collector recording a
                day&apos;s work to a merchant receiving a payment, we care about the details that
                make technology feel simple.
              </p>
              <p>
                Our Builders work alongside designers, product collaborators, and community
                partners. Continuous learning and open communication guide us as we make
                Afribit&apos;s systems faster, safer, and easier to use.
              </p>
              <p>
                We build with purpose: more opportunity, more ownership, and more useful Bitcoin in
                everyday life.
              </p>
              <Link href="/contact" className="builder-text-link">
                Build with us <ArrowUpRight size={18} />
              </Link>
            </Reveal>
          </div>
          <div className="builder-principles">
            {principles.map(({ icon: Icon, title, copy }, index) => (
              <Reveal key={title} delay={index * 0.07}>
                <Icon size={25} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{copy}</p>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="projects" className="builder-section builder-projects">
        <Container>
          <Reveal>
            <div className="builder-section-heading">
              <span className="builder-kicker">Inside the workshop</span>
              <span className="builder-mono">/ 03 PROJECTS</span>
            </div>
            <div className="builder-heading-row">
              <h2>
                Three builds.
                <br />
                One community.
              </h2>
              <p>
                Recycling, connectivity, and everyday trade. Different challenges, connected by a
                belief that useful technology starts close to home.
              </p>
            </div>
          </Reveal>
          {builderProjects.map((project, index) => {
            const Icon = icons[index]
            return (
              <div key={project.slug} className={`builder-project-row accent-${project.accent}`}>
                <Reveal className="builder-project-image">
                  <Link href={`/builders/${project.slug}`} tabIndex={-1} aria-hidden="true">
                    <Image
                      src={project.imageSrc}
                      alt={project.imageAlt}
                      fill
                      sizes="(max-width: 767px) 100vw, 50vw"
                    />
                  </Link>
                  <span className="builder-image-label">
                    <Icon size={17} /> {project.category}
                  </span>
                  {project.slug === 'afribit-wifi' && (
                    <span className="builder-image-credit">Concept illustration</span>
                  )}
                </Reveal>
                <Reveal className="builder-project-copy" delay={0.1}>
                  <div className="builder-project-meta">
                    <span className="builder-mono">PROJECT / {project.number}</span>
                    <span className="builder-stage">{project.stage}</span>
                  </div>
                  <h3>{project.name}</h3>
                  <p>{project.heroDescription}</p>
                  <ul className="builder-technologies" aria-label="Project technologies">
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
                      In collaboration with Insats <ArrowUpRight size={15} />
                    </a>
                  )}
                  <Link href={`/builders/${project.slug}`} className="builder-project-link">
                    Explore {project.slug === 'insats' ? 'the collaboration' : project.name}
                    <ArrowUpRight size={23} />
                  </Link>
                </Reveal>
              </div>
            )
          })}
        </Container>
      </section>

      <section id="observatory" className="builder-section builder-observatory">
        <Container>
          <Reveal>
            <div className="builder-section-heading">
              <span className="builder-kicker">Afribit x Insats</span>
              <a
                href="https://insats.org"
                target="_blank"
                rel="noopener noreferrer"
                className="builder-text-link"
              >
                insats.org <ArrowUpRight size={16} />
              </a>
            </div>
            <div className="builder-heading-row">
              <h2>
                Everyday prices.
                <br />A different perspective.
              </h2>
              <p>
                How far does money go in shillings and in sats? Explore the measurement approach
                behind our work with Insats.
              </p>
            </div>
          </Reveal>
          <InsatsObservatory />
        </Container>
      </section>

      <section className="builder-section builder-join">
        <Container>
          <Code2 size={36} aria-hidden="true" />
          <div>
            <span className="builder-kicker">Good work starts with a conversation</span>
            <h2>
              Bring your curiosity.
              <br />
              Build something that matters.
            </h2>
            <p>
              Developers, designers, community researchers, and partners: there is meaningful work
              to do together.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/contact">
              Connect with the Builders <ArrowUpRight size={18} />
            </Link>
          </Button>
        </Container>
      </section>
    </>
  )
}
