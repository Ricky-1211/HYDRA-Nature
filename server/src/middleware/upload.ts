import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure local uploads directory exists
const uploadDir = path.resolve(__dirname, '../../uploads/products');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer disk storage for local image persistence
const diskStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    // Generate clean sanitized filename
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `formulation-${uniqueSuffix}${ext}`);
  },
});

export const upload = multer({
  storage: diskStorage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit per file
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP, AVIF, GIF) are allowed.'));
    }
  },
});
