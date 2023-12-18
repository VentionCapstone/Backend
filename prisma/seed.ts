import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  const users = JSON.parse(readFileSync('./prisma/seeds/users.json', 'utf-8'));
  const accommodations = JSON.parse(readFileSync('./prisma/seeds/accommodations.json', 'utf-8'));

  // Create User
  for (const user of users) {
    await prisma.user.create({
      data: user,
      include: {
        profile: true,
      },
    });
  }

  // Craete Address
  for (const accommodation of accommodations) {
    await prisma.address.create({
      data: accommodation.address,
    });
  }

  // Create Accommodation
  for (const accommodation of accommodations) {
    await prisma.accommodation.create({
      data: {
        ...accommodation,
        address: {
          connect: {
            id: accommodation.address.id,
          },
        },
        media: {
          create: accommodation.media,
        },
        amenities: {
          create: accommodation.amenities,
        },
        reviews: {
          create: accommodation.reviews,
        },
      },
    });
  }

  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })

  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
