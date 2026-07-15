import { Request, Response } from 'express';
import prisma from '../config/db';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateToken } from '../utils/jwt.utils';
import crypto from 'crypto';
import { getIo } from '../sockets/index';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken({ userId: user.id, role: user.role });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarUrl: user.avatarUrl } });
  } catch (error) {
    console.error('[Login Error]', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const registerAdmin = async (req: Request, res: Response) => {
  try {
    // Hard kill switch: disable unless explicitly allowed via env.
    if (process.env.ALLOW_ADMIN_REGISTRATION !== 'true') {
      return res.status(403).json({ error: 'Registration disabled.' });
    }

    const count = await prisma.user.count();
    if (count > 0) {
      return res.status(403).json({ error: 'Registration closed. Initial admin already exists.' });
    }

    const { name, email, password } = req.body;
    if (!name || !email || !password || password.length < 8) {
      return res.status(400).json({ error: 'Name, email, and a password of 8+ characters are required.' });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role: 'SUPER_ADMIN' },
    });
    res.status(201).json({ message: 'Super admin created successfully', user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
// Step 1: Request a password reset code
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const user = await prisma.user.findUnique({ where: { email } });
    // Always return success to prevent email enumeration
    if (!user) return res.json({ message: 'If this email exists, a reset code has been sent to the Super Admin.' });

    // Generate a 6-digit numeric code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const resetCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const resetCodeHash = crypto.createHash('sha256').update(resetCode).digest('hex');

    await prisma.user.update({
      where: { email },
      data: { inviteToken: resetCodeHash, inviteTokenExpires: resetCodeExpires }
    });

    // Find the super admin to notify
    const superAdmin = await prisma.user.findFirst({ where: { role: 'SUPER_ADMIN' } });

    // In production, send an email. For now, emit via socket to SUPER_ADMIN.
    console.log('\n=========================================');
    console.log('[PASSWORD RESET] Code requested');
    console.log(`User: ${user.name} (${user.email})`);
    console.log(`Reset Code: ${resetCode}`);
    if (superAdmin) console.log(`Notify Super Admin: ${superAdmin.email}`);
    console.log(`Expires at: ${resetCodeExpires.toLocaleTimeString()}`);
    console.log('=========================================\n');

    // Emit a real-time notification to all connected SUPER_ADMINs
    try {
      const io = getIo();
      io.to('role_SUPER_ADMIN').emit('notification', {
        id: crypto.randomBytes(8).toString('hex'),
        type: 'password_reset',
        title: '🔑 Password Reset Request',
        message: `${user.name} (${user.email}) needs a password reset.`,
        code: resetCode,
        userName: user.name,
        userEmail: user.email,
        expiresAt: resetCodeExpires.toISOString(),
        time: new Date().toLocaleTimeString(),
      });
    } catch (socketErr) {
      // Socket not available – code is still in console
      console.log('Socket not available, code already logged above.');
    }

    res.json({ message: 'If this email exists, a reset code has been sent to the Super Admin.' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Step 2: Verify the 6-digit code
export const verifyResetCode = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' });

    const codeHash = crypto.createHash('sha256').update(code).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        email,
        inviteToken: codeHash,
        inviteTokenExpires: { gt: new Date() }
      }
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired reset code' });

    // Generate a short-lived reset token for the password change step
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    await prisma.user.update({
      where: { email },
      data: { inviteToken: resetTokenHash, inviteTokenExpires: new Date(Date.now() + 10 * 60 * 1000) } // 10 min
    });

    res.json({ resetToken, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Step 3: Reset the password using the token
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { resetToken, newPassword } = req.body;
    if (!resetToken || !newPassword) return res.status(400).json({ error: 'Token and new password are required' });
    if (newPassword.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });

    const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    const user = await prisma.user.findFirst({
      where: {
        inviteToken: tokenHash,
        inviteTokenExpires: { gt: new Date() }
      }
    });

    if (!user) return res.status(400).json({ error: 'Invalid or expired reset token' });

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, inviteToken: null, inviteTokenExpires: null }
    });

    res.json({ message: 'Password reset successfully', role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
