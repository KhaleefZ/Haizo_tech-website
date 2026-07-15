import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const blogs = await prisma.blog.findMany({ select: { id: true, title: true, imageUrl: true } });
  console.log('Blogs:', blogs);
  const works = await prisma.work.findMany({ select: { id: true, title: true, imageUrls: true } });
  console.log('Works:', works);
}
main().finally(() => prisma.$disconnect());
