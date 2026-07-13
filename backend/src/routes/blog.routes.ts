import { Router } from 'express';
import { getBlogs, getBlogById, createBlog, updateBlog, deleteBlog } from '../controllers/blog.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', getBlogs);
router.get('/:id', getBlogById);

// Protected routes (Admin/Manager/Dev)
router.post('/', authenticate, requireRole(['SUPER_ADMIN', 'MANAGER', 'DEV']), createBlog);
router.put('/:id', authenticate, requireRole(['SUPER_ADMIN', 'MANAGER', 'DEV']), updateBlog);
router.delete('/:id', authenticate, requireRole(['SUPER_ADMIN', 'MANAGER']), deleteBlog);

export default router;
