import { Router } from 'express';
import { getWorks, getWorkById, createWork, updateWork, deleteWork } from '../controllers/work.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Public read access
router.get('/', getWorks);
router.get('/:id', getWorkById);

// Protected write access
router.use(authenticate);
router.use(requireRole(['SUPER_ADMIN', 'MANAGER']));

router.post('/', createWork);
router.put('/:id', updateWork);
router.delete('/:id', deleteWork);

export default router;
