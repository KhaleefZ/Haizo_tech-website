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

// ---------- Middleware ----------
app.set('trust proxy', 1); // sits behind Nginx in production

app.use(helmet({
  crossOriginResourcePolicy: false, // keep until R2 replaces local uploads
}));
app.use(cors({ origin: config.corsOrigins, credentials: false }));
app.use(express.json({ limit: '1mb' }));

// ---------- Rate limiting ----------


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many attempts. Try again in 15 minutes.' },
});

const inquiryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many contact requests from this IP, please try again later.' },
});

app.use('/api/auth/login', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);
app.post('/api/inquiries', inquiryLimiter);

// ---------- Logging (dev only) ----------
if (!config.isProd) {
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      console.log(`${req.method} ${req.url} ${res.statusCode} ${Date.now() - start}ms`);
    });
    next();
  });
}

// ---------- Static uploads (TEMPORARY — remove once R2 is live) ----------
// Dev fallback. In production Nginx serves this directly from disk.
app.use('/uploads', express.static(config.uploadDir));

// ---------- Health ----------
app.get('/health', (_req: express.Request, res: express.Response) => res.json({ ok: true }));

// ---------- API Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/admin/users', userRoutes);
app.use('/api/works', workRoutes);
app.use('/api/work-categories', workCategoryRoutes);
app.use('/api/admin/works', workRoutes); // TODO: remove alias once admin frontend is updated
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/admin/inquiries', inquiryRoutes); // TODO: remove alias
app.use('/api/admin/projects', projectRoutes); // TODO: remove alias
app.use('/api/admin/tasks', taskRoutes);       // TODO: remove alias
app.use('/api/blogs', blogRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/backup', backupRoutes);
app.use('/api/announcements', announcementRoutes);

// ---------- Global Error Handler ----------
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  if (err?.message === 'Unsupported file type') {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Something went wrong' });
});

export default app;