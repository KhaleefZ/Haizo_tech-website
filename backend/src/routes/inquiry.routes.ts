import { Router } from 'express';
import { submitInquiry, getInquiries, updateInquiryStatus } from '../controllers/inquiry.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Public route to submit inquiries
router.post('/', submitInquiry);

// Protected routes for admins/managers
router.use(authenticate);
router.use(requireRole(['SUPER_ADMIN', 'MANAGER']));

router.get('/', getInquiries);
router.patch('/:id/status', updateInquiryStatus);

export default router;
