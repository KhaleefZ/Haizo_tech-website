import dotenv from 'dotenv';
import { z } from 'zod';
import path from 'path';

dotenv.config();

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(5001),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  CORS_ORIGINS: z.string().min(1),

  // Filesystem path where uploaded images are written.
  // MUST be outside the release directory in production.
  UPLOAD_DIR: z.string().min(1),

  // Public base URL those files are served from.
  PUBLIC_UPLOAD_URL: z.string().min(1),

  REVALIDATE_URL: z.string().optional(),
  REVALIDATE_SECRET: z.string().optional(),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

const e = parsed.data;

export const config = {
  isProd: e.NODE_ENV === 'production',
  port: e.PORT,
  jwtSecret: e.JWT_SECRET,
  databaseUrl: e.DATABASE_URL,
  corsOrigins: e.CORS_ORIGINS.split(',').map((s) => s.trim()),
  uploadDir: path.resolve(e.UPLOAD_DIR),
  publicUploadUrl: e.PUBLIC_UPLOAD_URL.replace(/\/$/, ''),
  revalidate: {
    url: e.REVALIDATE_URL,
    secret: e.REVALIDATE_SECRET,
  },
};