import { Request, Response } from 'express';
import prisma from '../config/db';

export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    // Determine which audiences the user can see
    let audienceFilter: string[] = ['ALL'];
    if (user.role === 'SUPER_ADMIN') {
      audienceFilter = ['ALL', 'MANAGER', 'DEV'];
    } else if (user.role === 'MANAGER') {
      audienceFilter = ['ALL', 'MANAGER'];
    } else if (user.role === 'DEV') {
      audienceFilter = ['ALL', 'DEV'];
    }

    const announcements = await prisma.announcement.findMany({
      where: { audience: { in: audienceFilter } },
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    });

    res.json(announcements);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { title, content, audience } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    if (audience && !['ALL', 'MANAGER', 'DEV'].includes(audience)) {
      return res.status(400).json({ error: 'Invalid audience. Must be ALL, MANAGER, or DEV' });
    }

    const announcement = await prisma.announcement.create({
      data: {
        title,
        content,
        audience: audience || 'ALL',
        authorId: user.userId
      },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    });

    res.status(201).json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create announcement' });
  }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, content, audience } = req.body;

    if (audience && !['ALL', 'MANAGER', 'DEV'].includes(audience)) {
      return res.status(400).json({ error: 'Invalid audience. Must be ALL, MANAGER, or DEV' });
    }

    const announcement = await prisma.announcement.update({
      where: { id },
      data: { title, content, audience },
      include: {
        author: {
          select: { id: true, name: true, avatarUrl: true }
        }
      }
    });

    res.json(announcement);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update announcement' });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.announcement.delete({ where: { id } });
    res.json({ message: 'Announcement deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete announcement' });
  }
};
