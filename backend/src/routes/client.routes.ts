import { Router } from 'express';
import { getClients, createClient, updateClient, deleteClient } from '../controllers/client.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// All roles can read clients
router.get('/', getClients);

// Only admins and managers can modify clients
router.post('/', requireRole(['SUPER_ADMIN', 'MANAGER']), createClient);
router.put('/:id', requireRole(['SUPER_ADMIN', 'MANAGER']), updateClient);
router.delete('/:id', requireRole(['SUPER_ADMIN', 'MANAGER']), deleteClient);

export default router;
