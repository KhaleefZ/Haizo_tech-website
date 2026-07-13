import { Request, Response } from 'express';
import { exec } from 'child_process';
import util from 'util';
import path from 'path';
import fs from 'fs';
import prisma from '../config/db';

const execPromise = util.promisify(exec);

export const exportDatabase = async (req: Request, res: Response) => {
  try {
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return res.status(500).json({ error: 'DATABASE_URL not configured' });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `haizo_backup_${timestamp}.sql`;
    const filepath = path.join(__dirname, '..', '..', 'tmp', filename);

    // Ensure tmp dir exists
    const tmpDir = path.join(__dirname, '..', '..', 'tmp');
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    // Run pg_dump
    await execPromise(`pg_dump "${dbUrl}" -F p -f "${filepath}"`);

    res.download(filepath, filename, (err) => {
      // Cleanup after download
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    });
  } catch (error) {
    console.error('Backup error:', error);
    res.status(500).json({ error: 'Database backup failed' });
  }
};

export const exportReport = async (req: Request, res: Response) => {
  try {
    // Generate a simple CSV report of users and project counts
    const users = await prisma.user.findMany();
    const projects = await prisma.project.count();
    const tasks = await prisma.task.count();
    const completedTasks = await prisma.task.count({ where: { isCompleted: true } });

    const csvLines = [
      'Report Type,Value',
      `Total Users,${users.length}`,
      `Total Projects,${projects}`,
      `Total Tasks,${tasks}`,
      `Completed Tasks,${completedTasks}`
    ];

    const csvContent = csvLines.join('\n');
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="haizo_report.csv"');
    res.send(csvContent);
  } catch (error) {
    console.error('Export report error:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
};
