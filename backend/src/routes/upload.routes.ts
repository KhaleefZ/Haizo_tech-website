import { Router } from 'express';
import multer from 'multer';
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env';
import { authenticate, requireRole } from '../middlewares/auth.middleware';

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/avif']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif']);

fs.mkdirSync(config.uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) {
      return cb(new Error('Unsupported file type'));
    }
    cb(null, true);
  },
});

const router = Router();

// Every route below requires a valid token. This was the hole.
router.use(authenticate, requireRole(['SUPER_ADMIN', 'MANAGER', 'DEV']));

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  res.json({ imageUrl: `${config.publicUploadUrl}/${req.file.filename}` });
});

// Delete by full URL in the body. basename() kills any traversal attempt.
router.delete('/', (req, res) => {
  try {
    const { imageUrl } = req.body as { imageUrl?: string };
    const prefix = `${config.publicUploadUrl}/`;

    if (!imageUrl || !imageUrl.startsWith(prefix)) {
      return res.status(400).json({ error: 'Invalid image URL' });
    }

    const filename = path.basename(imageUrl.slice(prefix.length));
    const filePath = path.join(config.uploadDir, filename);

    // Belt and braces: the resolved path must still be inside uploadDir.
    if (!filePath.startsWith(config.uploadDir + path.sep)) {
      return res.status(400).json({ error: 'Invalid path' });
    }

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'File not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error('Delete failed', err);
    res.status(500).json({ error: 'Delete failed' });
  }
});

export default router;