const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
  console.log('Fixing Blog images...');
  const blogs = await prisma.blog.findMany();
  for (const blog of blogs) {
    if (blog.imageUrl && blog.imageUrl.startsWith('/images/blogs/')) {
      const newUrl = blog.imageUrl.replace('/images/blogs/', '/uploads/');
      await prisma.blog.update({
        where: { id: blog.id },
        data: { imageUrl: newUrl }
      });
      console.log(`Updated blog ${blog.id} -> ${newUrl}`);
    }
  }

  console.log('Fixing Work images...');
  const works = await prisma.work.findMany();
  
  // Static placeholder images from Unsplash to prevent the "random image every load" issue
  const placeholders = [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop"
  ];

  for (const work of works) {
    let updated = false;
    const newImageUrls = work.imageUrls.map((url, index) => {
      if (url.includes('picsum.photos')) {
        updated = true;
        return placeholders[index % placeholders.length];
      }
      return url;
    });

    if (updated) {
      await prisma.work.update({
        where: { id: work.id },
        data: { imageUrls: newImageUrls }
      });
      console.log(`Updated work ${work.id} with static Unsplash placeholders`);
    }
  }

  console.log('Done!');
}

run().catch(console.error).finally(() => prisma.$disconnect());
