import { Request, Response } from 'express';
import prisma from '../config/db';
import { hashPassword } from '../utils/password.utils';
import bcrypt from 'bcryptjs';
import { AuthRequest } from '../middlewares/auth.middleware';
import crypto from 'crypto';
import { config } from '../config/env';
import { sendMail, inviteEmail } from '../utils/mailer';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, avatarUrl: true }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

export const getTeam = async (req: Request, res: Response) => {
  try {
    const team = await prisma.user.findMany({
      select: { id: true, name: true, role: true, avatarUrl: true }
    });
    res.json(team);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch team' });
  }
};

export const inviteUser = async (req: Request, res: Response) => {
  try {
    const { name, email, role, bio, password, avatarUrl } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Generate an invite token
    const inviteToken = password ? null : crypto.randomBytes(32).toString('hex');
    const inviteTokenExpires = password ? null : new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Use the provided password, or a placeholder if none is provided
    const finalPassword = password
      ? await hashPassword(password)
      : await hashPassword(crypto.randomBytes(16).toString('hex'));

    const user = await prisma.user.create({
      data: { name, email, role, bio, password: finalPassword, inviteToken, inviteTokenExpires, avatarUrl },
      select: { id: true, name: true, email: true, role: true, bio: true, inviteToken: true, avatarUrl: true }
    });

    if (!password && inviteToken) {
      const inviteUrl = `${config.adminBaseUrl}/invite/${inviteToken}`;
      const { subject, text, html } = inviteEmail(name, inviteUrl);
      const result = await sendMail({ to: email, subject, text, html });
      // Return the URL so the admin can copy it manually if email delivery failed.
      return res.status(201).json({ ...user, inviteUrl, emailSent: result.sent, emailError: result.reason });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to invite user' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name, role, bio, avatarUrl } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { name, role, bio, avatarUrl },
      select: { id: true, name: true, email: true, role: true, bio: true, avatarUrl: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    if (req.user?.userId === id) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }
    await prisma.user.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

export const setPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    if (!token || !password || password.length < 8) {
      return res.status(400).json({ error: 'Token and a password of at least 8 characters are required' });
    }
    const user = await prisma.user.findUnique({ where: { inviteToken: token } });

    if (!user || !user.inviteTokenExpires || user.inviteTokenExpires < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired invite token' });
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, inviteToken: null, inviteTokenExpires: null }
    });

    res.json({ message: 'Password set successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set password' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;

    if (req.user?.userId === id) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, role: true }
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.userId },
      select: { id: true, name: true, email: true, role: true, bio: true, avatarUrl: true, notificationsEnabled: true, maintenanceMode: true }
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { name, bio, avatarUrl } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user?.userId },
      data: { name, bio, avatarUrl },
      select: { id: true, name: true, email: true, role: true, bio: true, avatarUrl: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateSecurity = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user?.userId } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Incorrect current password' });

    const hashedPassword = await hashPassword(newPassword);
    await prisma.user.update({
      where: { id: req.user?.userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const updatePreferences = async (req: AuthRequest, res: Response) => {
  try {
    const { notificationsEnabled, maintenanceMode } = req.body;
    const user = await prisma.user.update({
      where: { id: req.user?.userId },
      data: { notificationsEnabled, maintenanceMode },
      select: { notificationsEnabled: true, maintenanceMode: true }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
