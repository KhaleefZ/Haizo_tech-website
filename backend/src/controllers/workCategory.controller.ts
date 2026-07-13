import { Request, Response } from 'express';
import prisma from '../config/db';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.workCategory.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  console.log('[CREATE CATEGORY] Request received:', req.body, 'User:', (req as any).user);
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });

    const maxOrderCat = await prisma.workCategory.findFirst({
      orderBy: { order: 'desc' }
    });
    
    const newOrder = maxOrderCat ? maxOrderCat.order + 1 : 0;
    console.log('[CREATE CATEGORY] Assigning order:', newOrder);

    const category = await prisma.workCategory.create({
      data: {
        name,
        order: newOrder
      }
    });
    res.status(201).json(category);
  } catch (error) {
    console.error('[CREATE CATEGORY ERROR]', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, order } = req.body;
    const category = await prisma.workCategory.update({
      where: { id },
      data: { name, order }
    });
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category' });
  }
};

export const updateCategoryOrders = async (req: Request, res: Response) => {
  try {
    const { items } = req.body as { items: { id: string, order: number }[] };
    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ error: 'Invalid items format' });
    }

    // Process in a transaction
    await prisma.$transaction(
      items.map(item => 
        prisma.workCategory.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );

    res.json({ message: 'Orders updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update category orders' });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.workCategory.delete({
      where: { id }
    });
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete category' });
  }
};
