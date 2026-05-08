import { Container } from '@/components/layout/container';
import { CardSpotlight } from '@/components/ui/card-spotlight';
import { ArrowRight, Mail, MapPin, MessageSquare, Clock, MessageCircle, Twitter, Instagram, Youtube, ExternalLink } from 'lucide-react';

// Contact channel data interface
export interface ContactChannel {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  value: string;
  link: string;
  color: string;
  bg: string;
}

// Updated contact channels data matching live site at https://afribit.africa/
const DEFAULT_CONTACT_CHANNELS: ContactChannel[] = [
  {
    icon: Mail,
    title: 'Email',
    description: 'General inquiries and partnerships',
    value: 'connect@afribit.africa',
    link: 'mailto:connect@afribit.africa',
    color: 'text-bitcoin',
    bg: 'bg-bitcoin/5',
  },
  {
    icon: MessageSquare,
    title: 'WhatsApp',
    description: 'Message us on WhatsApp',
    value: '+254 746 385 499',
    link: 'https://wa.me/254746385499',
    color: 'text-panafrican-green',
    bg: 'bg-panafrican-green/5',
  },
  {
    icon: MessageCircle,
    title: 'Telegram',
    description: 'Join our Telegram community',
    value: '@afribit_africa',
    link: 'https://t.me/afribit_africa',
    color: 'text-panafrican-red',
    bg: 'bg-panafrican-red/5',
  },
  {
    icon: Twitter,
    title: 'X (Twitter)',
    description: 'Follow us for updates',
    value: '@afribitkibera',
    link: 'https://x.com/afribitkibera',
    color: 'text-panafrican-gold',
    bg: 'bg-panafrican-gold/5',
  },
  {
    icon: Instagram,
    title: 'Instagram',
    description: 'See our latest stories',
    value: '@afribit_africa',
    link: 'https://www.instagram.com/afribit_africa/',
    color: 'text-bitcoin-light',
    bg: 'bg-bitcoin-light/5',
  },
  {
    icon: Youtube,
    title: 'YouTube',
    description: 'Watch our videos',
    value: '@AfribitAfrica',
    link: 'https://www.youtube.com/@AfribitAfrica',
    color: 'text-panafrican-green',
    bg: 'bg-panafrican-green/5',
  },
  {
    icon: ExternalLink,
    title: 'Medium',
    description: 'Read our articles',
    value: '@afribitkibera',
    link: 'https://medium.com/@afribitkibera',
    color: 'text-bitcoin',
    bg: 'bg-bitcoin/5',
  },
  {
    icon: MapPin,
    title: 'Location',
    description: 'Based in Kibera, Kenya',
    value: 'Kibera, Nairobi',
    link: 'https://maps.google.com/?q=Kibera,+Nairobi,+Kenya',
    color: 'text-panafrican-red',
    bg: 'bg-panafrican-red/5',
  },
  {
    icon: Clock,
    title: 'Hours',
    description: 'Our operating hours',
    value: 'Mon-Fri: 9AM - 5PM EAT',
    link: '',
    color: 'text-panafrican-gold',
    bg: 'bg-panafrican-gold/5',
  },
];

interface ContactChannelsProps {
  /** Optional custom contact channels array. If not provided, uses default channels */
  channels?: ContactChannel[];
  /** Optional custom section title */
  title?: string;
  /** Optional custom section description */
  description?: string;
}

export default function ContactChannels({ 
  channels = DEFAULT_CONTACT_CHANNELS,
  title = 'Multiple Ways to Connect',
  description = 'Choose the contact method that works best for you. We\'re available through various channels.'
}: ContactChannelsProps) {
  return (
    <section className="section">
      <Container>
        <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          <p className="max-w-2xl text-center text-lg text-muted-foreground">
            {description}
          </p>
        </div>

        {/* Contact Channels Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {channels.map((channel) => (
            <CardSpotlight
              key={channel.title}
              radius={300}
              color={channel.title === 'Email' ? 'rgba(247,147,26,0.12)' : 'rgba(0,135,81,0.08)'}
              className="h-full p-4 sm:p-6"
            >
              <div className="flex flex-col h-full">
                {/* Icon */}
                <div className={`inline-flex items-center justify-center size-10 sm:size-12 rounded-xl ${channel.bg} mb-3 sm:mb-4`}>
                  <channel.icon className={`size-6 ${channel.color}`} aria-hidden="true" />
                </div>

                {/* Content */}
                <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-1 sm:mb-2">
                  {channel.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 flex-grow">
                  {channel.description}
                </p>

                {/* Contact Value */}
                <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-border-soft">
                  {channel.link ? (
                    <a
                      href={channel.link}
                      target={channel.link.startsWith('http') ? '_blank' : undefined}
                      rel={channel.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                      aria-label={channel.title}
                      className="group inline-flex items-center gap-2"
                    >
                      <span className="font-medium text-foreground group-hover:text-bitcoin transition-colors">
                        {channel.value}
                      </span>
                      <ArrowRight className="size-4 text-bitcoin opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
                    </a>
                  ) : (
                    <span className="font-medium text-foreground">
                      {channel.value}
                    </span>
                  )}
                </div>
              </div>
            </CardSpotlight>
          ))}
        </div>
        </div>
      </Container>
    </section>
  );
}