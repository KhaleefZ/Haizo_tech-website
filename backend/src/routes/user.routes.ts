import { Router } from 'express';
import { getUsers, getTeam, inviteUser, updateUser, deleteUser, updateUserRole, getProfile, updateProfile, updateSecurity, updatePreferences, setPassword, validateInvite } from '../controllers/user.controller';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Public route for setting password via invite token
router.post('/set-password', setPassword);
router.get('/validate-invite', validateInvite);

router.use(authenticate);
// Profile routes (Any authenticated user)
router.get('/profile', getProfile);
router.patch('/profile', updateProfile);
router.patch('/security', updateSecurity);
router.patch('/preferences', updatePreferences);
router.get('/team', getTeam);

// Admin-only routes
router.get('/', requireRole(['SUPER_ADMIN']), getUsers);
router.post('/invite', requireRole(['SUPER_ADMIN']), inviteUser);
router.put('/:id', requireRole(['SUPER_ADMIN']), updateUser);
router.delete('/:id', requireRole(['SUPER_ADMIN']), deleteUser);
router.patch('/:id/role', requireRole(['SUPER_ADMIN']), updateUserRole);

export default router;
