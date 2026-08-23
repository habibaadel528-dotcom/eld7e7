import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { corsMiddleware } from './middleware/cors.middleware.js';
import { errorHandler } from './middleware/error.middleware.js';
import healthRoutes  from './routes/health.routes.js';
import authRoutes    from './routes/auth.routes.js';
import userRoutes    from './routes/user.routes.js';
import orderRoutes   from './routes/order.routes.js';
import productRoutes from './routes/product.routes.js';
import adminRoutes   from './routes/admin.routes.js';
import shippingZoneRoutes from './routes/shippingZone.routes.js';
import uploadRoutes  from './routes/upload.routes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

/* ── Global middleware ── */
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));

/* ── Routes ── */
app.use('/api',           healthRoutes);
app.use('/api/auth',      authRoutes);
app.use('/api/users',     userRoutes);
app.use('/api/orders',    orderRoutes);
app.use('/api/products',  productRoutes);
app.use('/api/admin',     adminRoutes);
app.use('/api/shipping-zones', shippingZoneRoutes);
app.use('/api/upload',    uploadRoutes);

/* ── Static: product images only — payment proofs are served via admin API ── */
app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, filePath) => {
    /* Block direct access to payment-proofs folder */
    if (filePath.includes('payment-proofs')) {
      res.status(403).end();
    }
  },
}));


/* ── 404 catch-all ── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

/* ── Global error handler (must be last) ── */
app.use(errorHandler);

export default app;
