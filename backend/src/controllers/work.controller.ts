import { Request, Response } from 'express';
import prisma from '../config/db';

export const getWorks = async (req: Request, res: Response) => {
  try {
    const { publishedOnly } = req.query;
    const where = publishedOnly === 'true' ? { published: true } : {};
    
    const works = await prisma.work.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json(works);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch works' });
  }
};

export const getWorkById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const work = await prisma.work.findUnique({ where: { id } });
    if (!work) return res.status(404).json({ error: 'Work not found' });
    res.json(work);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch work' });
  }
};

export const createWork = async (req: Request, res: Response) => {
  try {
    const work = await prisma.work.create({ data: req.body });
    res.status(201).json(work);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create work' });
  }
};

export const updateWork = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const work = await prisma.work.update({
      where: { id },
      data: req.body
    });
    res.json(work);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update work' });
  }
};

export const deleteWork = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.work.delete({ where: { id } });
    res.json({ message: 'Work deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete work' });
  }
};
