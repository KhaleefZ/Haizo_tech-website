import { Router } from 'express';
import { login, registerAdmin, forgotPassword, verifyResetCode, resetPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/login', login);
router.post('/register-initial-admin', registerAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-code', verifyResetCode);
router.post('/reset-password', resetPassword);

export default router;
