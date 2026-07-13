import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const result = await prisma.user.updateMany({ data: { role: 'SUPER_ADMIN' } });
  console.log(`Updated ${result.count} users to SUPER_ADMIN`);
}
main();
