import express from 'express';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

app.use(corsMiddleware);
app.use(express.json());
app.use(cookieParser());

app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
