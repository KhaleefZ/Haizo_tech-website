import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env';

// Routes
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import workRoutes from './routes/work.routes';
import workCategoryRoutes from './routes/workCategory.routes';
import inquiryRoutes from './routes/inquiry.routes';
import projectRoutes from './routes/project.routes';
import taskRoutes from './routes/task.routes';
import blogRoutes from './routes/blog.routes';
import clientRoutes from './routes/client.routes';
import dashboardRoutes from './routes/dashboard.routes';
import uploadRoutes from './routes/upload.routes';
import notificationRoutes from './routes/notification.routes';
import backupRoutes from './routes/backup.routes';
import announcementRoutes from './routes/announcement.routes';
import path from 'path';

const app = express();

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false // Allows loading local uploads in browser
}));
app.use(cors({ origin: config.corsOrigins }));
app.use(express.json());

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 requests per window
  message: { error: 'Too many contact requests from this IP, please try again later.' }
});

app.use('/api/inquiries', inquiryLimiter);

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[=>] ${req.method} ${req.url}`);
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[<=] ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
  });
  next();
});

app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/works', workRoutes);
app.use('/api/work-categories', workCategoryRoutes);
app.use('/api/admin/works', workRoutes); // Note: Admin overrides logic for creating/updating is handled in work.routes by middleware
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin/inquiries', inquiryRoutes);
app.use('/api/admin/projects', projectRoutes);
app.use('/api/admin/tasks', taskRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/clients', clientRoutes);
// also alias for API consistency
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/announcements', announcementRoutes);

// Global Error Handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;
