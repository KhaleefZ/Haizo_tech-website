import { Router } from 'express';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcement.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

// All authenticated users can read announcements (filtered by role in controller)
router.get('/', getAnnouncements);

// Only SUPER_ADMIN can create, update, delete
router.post('/', requireRole(['SUPER_ADMIN']), createAnnouncement);
router.put('/:id', requireRole(['SUPER_ADMIN']), updateAnnouncement);
router.delete('/:id', requireRole(['SUPER_ADMIN']), deleteAnnouncement);

export default router;
