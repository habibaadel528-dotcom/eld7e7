import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadsDir = path.join(__dirname, '../../uploads');

// بينشئ مجلد uploads لو مش موجود
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

function fileFilter(_req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const isValidType = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  if (isValidType) {
    cb(null, true);
  } else {
    cb(new Error('الملف لازم يكون صورة (jpg, png, webp, gif)'));
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ── Payment Proof Upload ── */
const paymentProofsDir = path.join(__dirname, '../../uploads/payment-proofs');
if (!fs.existsSync(paymentProofsDir)) {
  fs.mkdirSync(paymentProofsDir, { recursive: true });
}

const proofStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, paymentProofsDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `proof-${uniqueSuffix}${ext}`);
  },
});

function proofFileFilter(_req, file, cb) {
  const allowed = /jpeg|jpg|png/;
  if (allowed.test(path.extname(file.originalname).toLowerCase())) {
    cb(null, true);
  } else {
    cb(new Error('Payment proof must be a JPG, JPEG, or PNG image.'));
  }
}

export const uploadProof = multer({
  storage: proofStorage,
  fileFilter: proofFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export { uploadsDir, paymentProofsDir };

