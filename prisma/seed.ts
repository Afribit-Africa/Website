import { Prisma, PrismaClient } from '@prisma/client';
import { programs } from '../src/data/programs';
import { testimonials } from '../src/data/testimonials';
import { merchants } from '../src/data/merchants';

const prisma = new PrismaClient();

function decimal(value: number | undefined) {
  return new Prisma.Decimal(value ?? 0);
}

function programLocation(slug: string) {
  switch (slug) {
    case 'bitcoin-education':
    case 'business-accelerator':
    case 'waste-management':
    case 'boda-boda-compliance':
    case 'equipment-scaling':
      return {
        locationLabel: 'Kibera, Nairobi, Kenya',
        city: 'Nairobi',
        country: 'Kenya',
      };
    default:
      return {
        locationLabel: 'Nairobi, Kenya',
        city: 'Nairobi',
        country: 'Kenya',
      };
  }
}

function testimonialProgramSlug(testimonialId: string) {
  switch (testimonialId) {
    case 'fridah':
    case 'grace':
    case 'david':
      return 'business-accelerator';
    case 'mercy':
      return 'waste-management';
    case 'brian':
      return 'boda-boda-compliance';
    case 'lilian':
      return 'bitcoin-education';
    default:
      return null;
  }
}

async function seedPrograms() {
  for (const [index, program] of programs.entries()) {
    const location = programLocation(program.slug);

    await prisma.program.upsert({
      where: { slug: program.slug },
      update: {
        name: program.title,
        description: program.description,
        summary: program.description,
        coverImage: program.image,
        goal: decimal(program.goal),
        raised: decimal(program.raised),
        isActive: true,
        status: 'ACTIVE',
        featured: index < 3,
        order: index,
        ...location,
      },
      create: {
        name: program.title,
        slug: program.slug,
        description: program.description,
        summary: program.description,
        coverImage: program.image,
        goal: decimal(program.goal),
        raised: decimal(program.raised),
        isActive: true,
        status: 'ACTIVE',
        featured: index < 3,
        order: index,
        ...location,
      },
    });
  }
}

async function seedTestimonials() {
  for (const [index, testimonial] of testimonials.entries()) {
    const programSlug = testimonialProgramSlug(testimonial.id);
    const relatedProgram = programSlug
      ? await prisma.program.findUnique({ where: { slug: programSlug } })
      : null;

    await prisma.testimonial.upsert({
      where: { slug: testimonial.id },
      update: {
        name: testimonial.name,
        role: testimonial.role,
        location: testimonial.location,
        quote: testimonial.quote,
        image: testimonial.image,
        videoUrl: testimonial.videoUrl,
        youtubeId: testimonial.youtubeId,
        program: programSlug,
        programId: relatedProgram?.id,
        featured: index < 4,
        isActive: true,
        order: index,
      },
      create: {
        slug: testimonial.id,
        name: testimonial.name,
        role: testimonial.role,
        location: testimonial.location,
        quote: testimonial.quote,
        image: testimonial.image,
        videoUrl: testimonial.videoUrl,
        youtubeId: testimonial.youtubeId,
        program: programSlug,
        programId: relatedProgram?.id,
        featured: index < 4,
        isActive: true,
        order: index,
      },
    });
  }
}

async function seedMerchants() {
  for (const merchant of merchants) {
    const relatedProgram = merchant.programSlug
      ? await prisma.program.findUnique({ where: { slug: merchant.programSlug } })
      : null;
    const relatedTestimonial = await prisma.testimonial.findUnique({
      where: { slug: merchant.testimonialId },
    });

    const merchantRecord = await prisma.merchant.upsert({
      where: { slug: merchant.slug },
      update: {
        name: merchant.name,
        summary: merchant.summary,
        description: merchant.story,
        category: merchant.category,
        status: 'ACTIVE',
        locationLabel: merchant.location,
        neighborhood: merchant.neighborhood,
        city: merchant.city,
        country: merchant.country,
        latitude: merchant.latitude ? new Prisma.Decimal(merchant.latitude) : null,
        longitude: merchant.longitude ? new Prisma.Decimal(merchant.longitude) : null,
        acceptsBitcoin: merchant.paymentMethods.includes('Bitcoin'),
        paymentMethods: JSON.stringify(merchant.paymentMethods),
        services: JSON.stringify(merchant.services),
        primaryImage: merchant.image,
        videoUrl: merchant.videoUrl,
        youtubeId: merchant.youtubeId,
        featured: Boolean(merchant.featured),
        programId: relatedProgram?.id,
        primaryTestimonialId: relatedTestimonial?.id,
      },
      create: {
        name: merchant.name,
        slug: merchant.slug,
        summary: merchant.summary,
        description: merchant.story,
        category: merchant.category,
        status: 'ACTIVE',
        locationLabel: merchant.location,
        neighborhood: merchant.neighborhood,
        city: merchant.city,
        country: merchant.country,
        latitude: merchant.latitude ? new Prisma.Decimal(merchant.latitude) : null,
        longitude: merchant.longitude ? new Prisma.Decimal(merchant.longitude) : null,
        acceptsBitcoin: merchant.paymentMethods.includes('Bitcoin'),
        paymentMethods: JSON.stringify(merchant.paymentMethods),
        services: JSON.stringify(merchant.services),
        primaryImage: merchant.image,
        videoUrl: merchant.videoUrl,
        youtubeId: merchant.youtubeId,
        featured: Boolean(merchant.featured),
        programId: relatedProgram?.id,
        primaryTestimonialId: relatedTestimonial?.id,
      },
    });

    if (relatedTestimonial) {
      await prisma.testimonial.update({
        where: { id: relatedTestimonial.id },
        data: {
          merchantId: merchantRecord.id,
          programId: relatedProgram?.id,
          program: merchant.programSlug ?? null,
        },
      });
    }
  }
}

async function seedStatistics() {
  const statistics = [
    {
      key: 'bitcoin_transactions',
      value: '4000',
      label: 'Bitcoin Transactions in Kibera',
      suffix: '+',
      icon: 'TrendingUp',
      order: 0,
    },
    {
      key: 'youth_women_trained',
      value: '600',
      label: 'Youth & Women Trained',
      suffix: '+',
      icon: 'Users',
      order: 1,
    },
    {
      key: 'boda_riders_licensed',
      value: '40',
      label: 'Boda-Boda Riders Licensed',
      suffix: '+',
      icon: 'Zap',
      order: 2,
    },
    {
      key: 'merchants_onboarded',
      value: '41',
      label: 'Total merchants in the community',
      suffix: '+',
      icon: 'Heart',
      order: 3,
    },
  ];

  for (const statistic of statistics) {
    await prisma.statistic.upsert({
      where: { key: statistic.key },
      update: statistic,
      create: statistic,
    });
  }
}

async function main() {
  await seedPrograms();
  await seedTestimonials();
  await seedMerchants();
  await seedStatistics();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Seed failed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });