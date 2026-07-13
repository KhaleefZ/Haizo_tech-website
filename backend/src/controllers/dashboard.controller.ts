import { Request, Response } from 'express';
import prisma from '../config/db';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const clientsCount = await prisma.client.count();
    const projectsCount = await prisma.project.count();
    const tasksCount = await prisma.task.count();
    const inquiriesCount = await prisma.inquiry.count();
    const newInquiriesCount = await prisma.inquiry.count({ where: { status: 'NEW' } });
    const worksCount = await prisma.work.count();
    const blogsCount = await prisma.blog.count();
    const teamCount = await prisma.user.count(); // use users instead of teamMember
    
    // Recent activities (mixing new projects, inquiries, etc.)
    const recentProjects = await prisma.project.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
    const recentInquiries = await prisma.inquiry.findMany({ take: 3, orderBy: { submissionDate: 'desc' } });

    // Task Analytics
    const completedTasksCount = await prisma.task.count({
      where: { column: { name: { equals: 'Done', mode: 'insensitive' } } }
    });
    const completionRate = tasksCount === 0 ? 0 : Math.round((completedTasksCount / tasksCount) * 100);

    res.json({
      counts: {
        clients: clientsCount,
        projects: projectsCount,
        tasks: tasksCount,
        inquiries: inquiriesCount,
        newInquiries: newInquiriesCount,
        works: worksCount,
        blogs: blogsCount,
        team: teamCount,
      },
      analytics: {
        completedTasks: completedTasksCount,
        completionRate
      },
      recentActivity: {
        projects: recentProjects,
        inquiries: recentInquiries
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats' });
  }
};
