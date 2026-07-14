import dotenv from 'dotenv';
import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD are required');
  }
  if (password.length < 12) {
    throw new Error('SEED_ADMIN_PASSWORD must be at least 12 characters');
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: passwordHash,
      name: 'Admin',
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`admin user ready: ${admin.email}`);

  const categories = [
    { name: 'Custom Software Development', order: 0 },
    { name: 'Web & Mobile Apps', order: 1 },
    { name: 'AI Systems & Integration', order: 2 },
    { name: 'Network Solutions', order: 3 },
  ];

  for (const c of categories) {
    await prisma.workCategory.upsert({
      where: { name: c.name },
      update: { order: c.order },
      create: c,
    });
  }
  console.log(`${categories.length} work categories ready`);
  console.log('Production seed complete. No demo data created.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });