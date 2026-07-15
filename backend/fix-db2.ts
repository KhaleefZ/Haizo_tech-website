import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const blogs = await prisma.blog.findMany();
  for (const blog of blogs) {
    if (blog.imageUrl && blog.imageUrl.startsWith('http://127.0.0.1:5001')) {
      await prisma.blog.update({
        where: { id: blog.id },
        data: { imageUrl: blog.imageUrl.replace('http://127.0.0.1:5001', '') }
      });
      console.log(`Updated blog ${blog.id}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
