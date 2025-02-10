import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
async function main() {
  const users = [];

  // Criação de 3 usuários
  for (let i = 0; i < 3; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        username: faker.internet.username(),
        avatar: faker.image.avatar(),
        password: hashedPassword,
        // links: {
        //   create: [
        //     {
        //       name: faker.lorem.word(),
        //       url: faker.internet.url(),
        //       image: faker.image.urlLoremFlickr(),
        //       active: true,
        //       linkClick: {
        //         create: [
        //           {
        //             clickedAt: faker.date.recent(),
        //             ipAddress: faker.internet.ip(),
        //             userAgent: faker.internet.userAgent(),
        //             referrer: faker.internet.url(),
        //           },
        //           {
        //             clickedAt: faker.date.recent(),
        //             ipAddress: faker.internet.ip(),
        //             userAgent: faker.internet.userAgent(),
        //             referrer: faker.internet.url(),
        //           },
        //         ],
        //       },
        //     },
        //     {
        //       name: faker.lorem.word(),
        //       url: faker.internet.url(),
        //       image: faker.image.urlLoremFlickr(),
        //       active: true,
        //       linkClick: {
        //         create: [
        //           {
        //             clickedAt: faker.date.recent(),
        //             ipAddress: faker.internet.ip(),
        //             userAgent: faker.internet.userAgent(),
        //             referrer: faker.internet.url(),
        //           },
        //         ],
        //       },
        //     },
        //   ],
        // },
      },
    });
    users.push(user);
  }

  console.log('Seeding completed:');
  console.log(users);
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
