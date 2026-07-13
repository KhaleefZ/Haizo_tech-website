import { Router } from 'express';
import { getProjects, createProject, updateProject, deleteProject, initKanbanBoard, getProjectById } from '../controllers/project.controller';
import { getKanbanBoard, createColumn, updateColumn, deleteColumn, moveColumn } from '../controllers/kanban.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// Read access for all authenticated users
router.get('/', getProjects);
router.get('/:projectId', getProjectById);
router.get('/:projectId/kanban', getKanbanBoard);

// Write access for admins and managers
router.post('/', requireRole(['SUPER_ADMIN', 'MANAGER']), createProject);
router.post('/:id/init-kanban', requireRole(['SUPER_ADMIN', 'MANAGER']), initKanbanBoard);
router.put('/:id', requireRole(['SUPER_ADMIN', 'MANAGER']), updateProject);
router.delete('/:id', requireRole(['SUPER_ADMIN', 'MANAGER']), deleteProject);

// Kanban Columns
router.post('/:projectId/columns', requireRole(['SUPER_ADMIN', 'MANAGER']), createColumn);
router.put('/columns/:columnId', requireRole(['SUPER_ADMIN', 'MANAGER']), updateColumn);
router.patch('/columns/:columnId/move', requireRole(['SUPER_ADMIN', 'MANAGER']), moveColumn);
router.delete('/columns/:columnId', requireRole(['SUPER_ADMIN', 'MANAGER']), deleteColumn);

export default router;
