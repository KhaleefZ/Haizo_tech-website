import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const blogs = await prisma.blog.findMany();
  for (const blog of blogs) {
    if (blog.imageUrl && blog.imageUrl.startsWith('http://localhost:5001')) {
      await prisma.blog.update({
        where: { id: blog.id },
        data: { imageUrl: blog.imageUrl.replace('http://localhost:5001', '') }
      });
      console.log(`Updated blog ${blog.id}`);
    }
  }

  const users = await prisma.user.findMany();
  for (const user of users) {
    if (user.avatarUrl && user.avatarUrl.startsWith('http://localhost:5001')) {
      await prisma.user.update({
        where: { id: user.id },
        data: { avatarUrl: user.avatarUrl.replace('http://localhost:5001', '') }
      });
      console.log(`Updated user ${user.id}`);
    }
  }

  const works = await prisma.work.findMany();
  for (const work of works) {
    let updated = false;
    const newImageUrls = work.imageUrls.map(url => {
      if (url.startsWith('http://localhost:5001')) {
        updated = true;
        return url.replace('http://localhost:5001', '');
      }
      return url;
    });
    if (updated) {
      await prisma.work.update({
        where: { id: work.id },
        data: { imageUrls: newImageUrls }
      });
      console.log(`Updated work ${work.id}`);
    }
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
