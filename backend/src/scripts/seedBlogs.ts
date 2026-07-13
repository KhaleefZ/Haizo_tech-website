import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const author = await prisma.user.findFirst();
  if (!author) {
    console.log('No user found to set as author. Exiting.');
    return;
  }

  const blogs = [
    {
      title: 'The Future of Software Architecture: Microservices vs Monoliths',
      content: 'In the rapidly evolving landscape of software engineering, the debate between microservices and monoliths continues. This article explores the trade-offs, scaling strategies, and how to choose the right architecture for your next big project. By breaking down applications into independent, deployable services, teams can achieve greater agility...',
      authorId: author.id,
      tags: ['Architecture', 'Microservices', 'Engineering'],
      imageUrl: '/images/blogs/blog_tech_future_1783790852072.png',
      published: true
    },
    {
      title: 'Mastering Agile with Kanban: Boosting Team Productivity',
      content: 'Agile methodologies have transformed how we build products. Kanban, a visual system for managing work as it moves through a process, is at the forefront of this revolution. Discover how visualizing your workflow, limiting work in progress, and continuous delivery can supercharge your development team’s output while reducing burnout.',
      authorId: author.id,
      tags: ['Agile', 'Kanban', 'Productivity'],
      imageUrl: '/images/blogs/blog_agile_kanban_1783790862102.png',
      published: true
    },
    {
      title: 'AI in Enterprise: Driving Business Growth with Machine Learning',
      content: 'Artificial Intelligence is no longer just a buzzword; it is a critical driver for enterprise growth. From predictive analytics to automated customer service, machine learning models are optimizing operations across all sectors. We dive deep into real-world applications of AI that are delivering tangible ROI for modern businesses.',
      authorId: author.id,
      tags: ['AI', 'Machine Learning', 'Business'],
      imageUrl: '/images/blogs/blog_ai_business_1783790871844.png',
      published: true
    }
  ];

  for (const blog of blogs) {
    await prisma.blog.create({ data: blog });
  }

  console.log('Successfully seeded 3 blogs.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
