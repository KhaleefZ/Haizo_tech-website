import { Request, Response } from 'express';
import prisma from '../config/db';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    const notifications = await prisma.notification.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: 'desc' },
      take: 50 // Limit to last 50 for performance
    });

    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const notificationId = req.params.id as string;
    const user = (req as any).user;

    await prisma.notification.updateMany({
      where: { 
        id: notificationId,
        userId: user.userId // Security check
      },
      data: { isRead: true }
    });

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to mark notification as read' });
  }
};
