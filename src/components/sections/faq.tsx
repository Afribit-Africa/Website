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
    a: 'Afribit is a grassroots organisation building a Bitcoin circular economy in Kibera, one of Africa\'s largest informal settlements. We leverage Bitcoin to create financial inclusion, environmental stewardship, and community resilience through education, waste management, micro-loans, and merchant onboarding.',
  },
  {
    q: 'Why Bitcoin? Why not use mobile money or cash?',
    a: 'Bitcoin offers true financial sovereignty without the need for bank accounts or documentation — critical in a community where 80% are unbanked. It\'s borderless, transparent, and can\'t be censored. Unlike mobile money, Bitcoin allows locals to save, earn, and transact without intermediaries taking fees or controlling their funds.',
  },
  {
    q: 'How do residents earn Bitcoin?',
    a: 'Residents earn Bitcoin through multiple programmes: collecting waste and receiving satoshi rewards, running Bitcoin-accepting businesses, participating in upcycling workshops with weekly stipends, completing driving classes as boda-boda riders, and attending Bitcoin education meetups.',
  },
  {
    q: 'How does the Bitcoin circular economy actually work?',
    a: "It's a self-sustaining loop: residents earn sats through work (waste collection, upcycling, merchant sales), then spend those sats at local merchants who also accept Bitcoin. This keeps value circulating within the community, building local wealth instead of extracting it.",
  },
  {
    q: 'What programmes can I support with my donation?',
    a: 'Five key initiatives: Bitcoin Education (training 500 community ambassadors), Boda-Boda Compliance (licensing and training riders), Waste Management Expansion (Bitcoin-incentivised recycling), Upcycling & Women\'s Empowerment (sponsoring micro-entrepreneurs), and Business Accelerator (micro-loans for local enterprises).',
  },
  {
    q: 'Can I donate in Bitcoin?',
    a: 'Yes! All donations through our BTCPay Server crowdfund can be paid with Bitcoin (on-chain or Lightning Network), ensuring your contribution goes directly to programmes without intermediaries.',
  },
  {
    q: 'How transparent is Afribit with donations?',
    a: 'We publish regular impact reports showing exactly how funds are used. Bitcoin\'s transparent blockchain means every transaction is verifiable. We are listed on BTC Map, Geyser Fund, and partnered with Bitcoin Confederation for accountability.',
  },
  {
    q: 'How can I get involved beyond donating?',
    a: 'Volunteer remotely, share our story on social media, connect us with Bitcoin companies for partnerships, sponsor specific equipment or training cohorts, or visit Kibera to see the impact firsthand. Reach out at connect@afribit.africa.',
  },
]

export function FAQ() {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-2xl mx-auto">
          <div className="mb-12 text-center">
            <Badge variant="secondary" className="mb-4">
              FAQ
            </Badge>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">
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
