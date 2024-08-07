import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'agung.e.sptr@gmail.com' },
    update: {},
    create: {
      email: 'agung.e.sptr@gmail.com',
      name: 'Agung Saputra',
      password: '$2b$10$ZlaoBDcKkLlr/ErkiRC5QuquPvmnzhZNGDLk1mSaKoSDJ.K00olCm', // password: "secret" -> Generate using Bun.password.hash with alg: bcrypt and cost: 10
    },
  });

  const data = [
    {
      title: 'Prisma Adds Support for MongoDB',
      body: 'Support for MongoDB has been one of the most requested features since the initial release of...',
      description:
        "We are excited to share that today's Prisma ORM release adds stable support for MongoDB!",
      published: false,
      userId: user.id,
    },
    {
      title: "What's new in Prisma? (Q1/22)",
      body: 'Our engineers have been working hard, issuing new releases with many improvements...',
      description:
        'Learn about everything in the Prisma ecosystem and community from January to March 2022.',
      published: true,
      userId: user.id,
    },
  ];

  await prisma.article.createMany({ data, skipDuplicates: true });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
