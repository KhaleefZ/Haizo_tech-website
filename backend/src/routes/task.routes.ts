import { Router } from 'express';
import { createTask, moveTask, updateTask, deleteTask } from '../controllers/kanban.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// Admin / Manager can create tasks
router.post('/', requireRole(['SUPER_ADMIN', 'MANAGER']), createTask);

// Devs, Managers, Admins can move/update tasks
router.patch('/:taskId/move', moveTask);
router.patch('/:taskId', updateTask);

// Admin / Manager can delete tasks
router.delete('/:taskId', requireRole(['SUPER_ADMIN', 'MANAGER']), deleteTask);

export default router;
