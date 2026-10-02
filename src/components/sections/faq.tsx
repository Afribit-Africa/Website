import { Container } from '@/components/layout/container'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

const FAQ_ITEMS = [
  {
    q: 'What is Afribit and what do you do?',
    a: "Afribit is a grassroots organisation supporting a Bitcoin circular economy in Kibera, Nairobi. Our work connects Bitcoin education, merchant onboarding, waste incentives, women's upcycling, and rider compliance support.",
  },
  {
    q: 'Why Bitcoin? Why not use mobile money or cash?',
    a: 'Bitcoin gives residents and businesses another way to earn, save, and pay. Afribit helps people understand wallets, Lightning payments, security, and the fees and custody arrangements of the tools they choose.',
  },
  {
    q: 'How do residents earn Bitcoin?',
    a: 'Residents can receive Bitcoin through local trade and waste collection incentives. Afribit supports wallet education and onboarding so participants can use Bitcoin in community commerce.',
  },
  {
    q: 'How does the Bitcoin circular economy actually work?',
    a: 'Residents and local businesses can earn sats and spend them with merchants who accept Bitcoin. Afribit supports the education and onboarding that help those payments become part of everyday trade.',
  },
  {
    q: 'What programmes can I support with my donation?',
    a: "Your donation supports Afribit's work in Bitcoin education, merchant onboarding, waste incentives, women's upcycling, and rider compliance in Kibera.",
  },
  {
    q: 'Can I donate in Bitcoin?',
    a: 'Yes. Donate through the Lightning address or QR code on our donation page.',
  },
  {
    q: 'How can I learn more about donation use?',
    a: "Contact connect@afribit.africa for information about how donations support Afribit's community work in Kibera.",
  },
  {
    q: 'How can I get involved beyond donating?',
    a: 'Share our story, connect us with potential partners, or contact connect@afribit.africa about volunteering and supporting community activities.',
  },
]

export function FAQ() {
  return (
    <section className="section">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="section-intro">
            <Badge variant="secondary" className="mb-4">
              FAQ
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-0">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {FAQ_ITEMS.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger>{item.q}</AccordionTrigger>
                <AccordionContent>{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  )
}
