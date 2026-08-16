import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import uploadRoutes from './routes/upload.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

// بيخلي الصور اللي في مجلد uploads متاحة عن طريق رابط مباشر
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
