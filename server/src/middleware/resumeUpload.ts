import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure local resumes upload directory exists
const resumeDir = path.resolve(__dirname, '../../uploads/resumes');
if (!fs.existsSync(resumeDir)) {
  fs.mkdirSync(resumeDir, { recursive: true });
}

const resumeStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, resumeDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.pdf';
    const cleanBaseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `resume-${cleanBaseName}-${uniqueSuffix}${ext}`);
  },
});

export const resumeUpload = multer({
  storage: resumeStorage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB limit for resumes
  },
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (
      allowedExtensions.includes(ext) ||
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype.startsWith('image/')
    ) {
      cb(null, true);
    } else {
      cb(new Error('Only document files (PDF, DOC, DOCX, JPG, PNG) are allowed for resumes.'));
    }
  },
});
