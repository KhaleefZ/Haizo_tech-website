import { Router } from 'express';
import { exportDatabase, exportReport } from '../controllers/backup.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Require both authentication and SUPER_ADMIN role for all backup routes
router.use(authenticate);
router.use(requireRole(['SUPER_ADMIN']));

router.get('/db', exportDatabase);
router.get('/export', exportReport);

export default router;
