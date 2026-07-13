import { PrismaClient, Role, InquiryStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting DB seeding...');

  // 1. Create Users
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@haizotech.com' },
    update: {},
    create: {
      email: 'admin@haizotech.com',
      password: passwordHash,
      name: 'Admin User',
      role: Role.SUPER_ADMIN,
    },
  });

  const devUser = await prisma.user.upsert({
    where: { email: 'dev@haizotech.com' },
    update: {},
    create: {
      email: 'dev@haizotech.com',
      password: passwordHash,
      name: 'Dev User',
      role: Role.DEV,
    },
  });

  // 2. Create Clients
  const client = await prisma.client.create({
    data: {
      organization: 'Acme Corp',
      contactName: 'John Doe',
      email: 'john@acme.com',
    },
  });

  // 3. Create Projects, Columns, and Tasks
  const project = await prisma.project.create({
    data: {
      name: 'Apollo Migration',
      description: 'Migrating legacy infrastructure',
      clientId: client.id,
      columns: {
        create: [
          {
            name: 'Backlog',
            order: 0,
            tasks: {
              create: [
                {
                  title: 'Setup Kubernetes',
                  order: 0,
                  assigneeId: devUser.id,
                  tags: ['DevOps'],
                }
              ]
            }
          },
          {
            name: 'In Progress',
            order: 1,
            tasks: {
              create: [
                {
                  title: 'Migrate DB',
                  order: 0,
                  assigneeId: devUser.id,
                  tags: ['Database'],
                }
              ]
            }
          }
        ]
      }
    }
  });

  // 4. Create Work Categories
  await prisma.workCategory.deleteMany();
  await prisma.workCategory.createMany({
    data: [
      { name: 'Custom Software Development', order: 0 },
      { name: 'Web & Mobile Apps', order: 1 },
      { name: 'AI Systems & Integration', order: 2 },
      { name: 'Network Solutions', order: 3 }
    ]
  });

  // 5. Create Works (Portfolio)
  await prisma.work.deleteMany();
  await prisma.work.create({
    data: {
      title: 'Sri ASK Residency',
      category: 'Web & Mobile Apps',
      description: 'A premium website and administrative hotel management software developed for Sri ASK Residency in Sulur, Coimbatore. The platform integrates a real-time Room & Suite availability calendar, room booking options with instant Razorpay checkout payment gateway integration, valet parking indicators, and a robust 24/7 staff service coordination dashboard.',
      imageUrls: [
        'https://picsum.photos/800/600?random=1',
        'https://picsum.photos/800/600?random=3',
        'https://picsum.photos/800/600?random=4'
      ],
      liveUrl: 'https://sriaskresidency.com/',
      published: true,
    }
  });

  await prisma.work.create({
    data: {
      title: 'Tshirt Ink Printing Works',
      category: 'Custom Software Development',
      description: 'An online portal for custom t-shirt ink printing orders and catalog viewing.',
      imageUrls: ['https://picsum.photos/800/600?random=2'],
      published: true,
    }
  });

  // 5. Create Blogs
  await prisma.blog.create({
    data: {
      title: 'The Future of AI in Operations',
      content: 'Artificial Intelligence is revolutionizing how we manage operations...',
      authorId: adminUser.id,
      tags: ['AI', 'Operations'],
      published: true,
      imageUrl: 'https://picsum.photos/800/600',
    }
  });

  // 6. Create Inquiries
  await prisma.inquiry.create({
    data: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      message: 'I am interested in your web development services.',
      status: InquiryStatus.NEW,
    }
  });

  console.log('Seeding finished successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
