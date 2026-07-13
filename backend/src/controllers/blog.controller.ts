import { Request, Response } from 'express';
import prisma from '../config/db';

export const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true, email: true } } }
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const blog = await prisma.blog.findUnique({
      where: { id },
      include: { author: { select: { name: true, email: true } } }
    });
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, tags, imageUrl, published } = req.body;
    
    // In a real app, authorId comes from req.user (from auth middleware)
    // For now, we'll pick the first admin user
    const admin = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });
    
    if (!admin) {
      return res.status(500).json({ error: 'No admin user found to assign as author' });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        tags: tags || [],
        imageUrl,
        published: published ?? false,
        authorId: admin.id
      }
    });
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { title, content, tags, imageUrl, published } = req.body;
    
    const blog = await prisma.blog.update({
      where: { id },
      data: { title, content, tags, imageUrl, published }
    });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await prisma.blog.delete({ where: { id } });
    res.json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};
