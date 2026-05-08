import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
Promise.all([p.program.count(), p.merchant.count(), p.testimonial.count(), p.statistic.count()])
  .then(([prog, merch, test, stat]) => {
    console.log(`programs: ${prog}, merchants: ${merch}, testimonials: ${test}, statistics: ${stat}`);
    return p.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await p.$disconnect();
    process.exit(1);
  });
