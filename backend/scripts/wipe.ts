import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Wiping database data...');

  await prisma.subtask.deleteMany();
  await prisma.task.deleteMany();
  await prisma.column.deleteMany();
  await prisma.project.deleteMany();
  await prisma.work.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.inquiry.deleteMany();
  await prisma.client.deleteMany();
  await prisma.teamMember.deleteMany();

  // We DO NOT wipe users so the admin login still works

  console.log('Database wiped successfully! Clean slate ready.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
