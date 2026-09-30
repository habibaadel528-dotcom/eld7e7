import multer from 'multer';
import path from 'path';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/* ────────────────────────────────────────────────────────────────
   Product Images → Cloudinary (Persistent Storage)
   روابط الصور تبدأ بـ https:// دائماً ولا تختفي عند Redeploy
   ──────────────────────────────────────────────────────────────── */
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder:         'eld7e7/products',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    public_id: (_req, file) => {
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      const name = path.parse(file.originalname).name
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      return `product_${name}_${uniqueSuffix}`;
    },
  },
});

function imageFileFilter(_req, file, cb) {
  const allowedTypes = /jpeg|jpg|png|webp|gif/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('الملف لازم يكون صورة (jpg, png, webp, gif)'));
  }
}

export const upload = multer({
  storage: cloudinaryStorage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* ────────────────────────────────────────────────────────────────
   Payment Proof Upload → Local (admin-only, never exposed publicly)
   إثباتات الدفع تبقى على الـ filesystem المحلي لأنها حساسة
   ──────────────────────────────────────────────────────────────── */
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

export { paymentProofsDir };
