import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const schema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(5001),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  CORS_ORIGINS: z.string().min(1),

  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET: z.string().min(1),
  R2_PUBLIC_URL: z.string().min(1),

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
  r2: {
    accountId: e.R2_ACCOUNT_ID,
    accessKeyId: e.R2_ACCESS_KEY_ID,
    secretAccessKey: e.R2_SECRET_ACCESS_KEY,
    bucket: e.R2_BUCKET,
    publicUrl: e.R2_PUBLIC_URL.replace(/\/$/, ''),
  },
  revalidate: {
    url: e.REVALIDATE_URL,
    secret: e.REVALIDATE_SECRET,
  },
};