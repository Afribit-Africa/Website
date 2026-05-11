import type { Metadata } from 'next';
import { generateMetadata } from '@/lib/metadata';
import { Container } from '@/components/layout/container';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { Button } from '@/components/ui/button';
import { ContactHero } from '@/components/contact/ContactHero';
import ContactChannels from '@/components/contact/ContactChannels';
import { ContactForm } from '@/components/contact/ContactForm';
import { MessageSquare, Zap, Users } from 'lucide-react';

// Generate SEO metadata for the contact page
export const metadata: Metadata = generateMetadata({
  title: 'Contact Us',
  description: 'Get in touch with Afribit Africa. Reach out for inquiries, partnerships, media requests, or to learn more about our Bitcoin initiatives across Africa.',
  path: '/contact',
  keywords: ['contact Afribit', 'Bitcoin Africa contact', 'partnership inquiries', 'media contact', 'Africa Bitcoin support'],
});

// FAQ data for contact page
const CONTACT_FAQS = [
  {
    question: 'How quickly will I get a response?',
    answer: "We aim to respond to all inquiries within 24 hours during business days. For urgent matters, please call our phone line.",
  },
  {
    question: 'Do you have offices in other African countries?',
    answer: "We currently operate primarily from Uganda with partners across East Africa. We're expanding to other regions - reach out to discuss potential partnerships.",
  },
  {
    question: 'Can I visit your office in person?',
    answer: 'Yes! We welcome visitors by appointment. Please contact us to schedule a visit to our Kampala office.',
  },
  {
    question: 'Do you offer Bitcoin education or workshops?',
    answer: 'Absolutely! We run regular Bitcoin education programs across Africa. Contact us to schedule a workshop for your community or organization.',
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Skip to content link for screen readers */}
      <a 
        href="#contact-form" 
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-bitcoin focus:text-white focus:rounded-lg"
      >
        Skip to contact form
      </a>
      
      {/* Hero Section */}
      <ContactHero />

      {/* Contact Channels Section */}
      <ContactChannels />

      {/* Contact Form Section */}
      <section id="contact-form" className="section-lg">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Send Us a Message
              </h2>
              <p className="max-w-2xl text-center text-lg text-muted-foreground">
                Fill out the form below and we&apos;ll get back to you as soon as possible.
              </p>
            </div>
            <ContactForm />
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="section">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center">
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="max-w-2xl text-center text-lg text-muted-foreground">
                Quick answers to common questions about contacting us.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {CONTACT_FAQS.map((faq, index) => (
                <CardSpotlight
                  key={index}
                  radius={250}
                  color="rgba(0,135,81,0.08)"
                  className="p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="inline-flex items-center justify-center size-10 rounded-lg bg-panafrican-green/10">
                      <MessageSquare className="size-5 text-panafrican-green" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-bold text-foreground mb-2">
                        {faq.question}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                </CardSpotlight>
              ))}
            </div>

            <div className="text-center mt-12 pt-8 border-t border-border-soft">
              <div className="inline-flex items-center gap-3 mb-4">
                <Users className="size-5 text-bitcoin" aria-hidden="true" />
                <span className="text-sm font-medium text-bitcoin">STILL HAVE QUESTIONS?</span>
              </div>
              <h3 className="font-display text-2xl font-bold text-foreground mb-4">
                Need more specific help?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Our team is ready to assist you with any questions about Bitcoin adoption,
                partnership opportunities, or our programs across Africa.
              </p>
              <Button asChild size="lg">
                <a href="mailto:connect@afribit.africa">
                  Email Afribit
                  <Zap className="size-4 ml-2" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
