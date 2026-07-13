import express from 'express';
import { 
  getCategories, 
  createCategory, 
  updateCategory, 
  deleteCategory,
  updateCategoryOrders
} from '../controllers/workCategory.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = express.Router();

// Public route
router.get('/', getCategories);

// Protected routes (Only SUPER_ADMIN and MANAGER can modify categories)
router.post('/', authenticate, requireRole(['SUPER_ADMIN', 'MANAGER']), createCategory);
router.put('/reorder', authenticate, requireRole(['SUPER_ADMIN', 'MANAGER']), updateCategoryOrders);
router.put('/:id', authenticate, requireRole(['SUPER_ADMIN', 'MANAGER']), updateCategory);
router.delete('/:id', authenticate, requireRole(['SUPER_ADMIN', 'MANAGER']), deleteCategory);

export default router;
