import { prisma } from '../src/lib/prisma';

async function main() {
  const stats = await prisma.statistic.findMany({ orderBy: { order: 'asc' } });
  console.log(JSON.stringify(stats, null, 2));
  await prisma.$disconnect();
}
main();
