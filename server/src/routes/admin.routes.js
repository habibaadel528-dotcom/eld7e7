import { Router } from 'express';
import { protect, adminOnly } from '../middleware/auth.middleware.js';
import {
  getStats,
  getCustomers,
  getCustomerById,
  updateCustomer,
  getAllOrders,
  updateOrderStatus,
  verifyPayment,
  getPaymentProof,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/admin.controller.js';

const router = Router();

/* All admin routes require auth + admin role */
router.use(protect, adminOnly);

/* Stats */
router.get('/stats', getStats);

/* Customers */
router.get('/customers',      getCustomers);
router.get('/customers/:id',  getCustomerById);
router.patch('/customers/:id', updateCustomer);

/* Orders */
router.get('/orders',                          getAllOrders);
router.patch('/orders/:id/status',             updateOrderStatus);
router.patch('/orders/:id/verify-payment',     verifyPayment);
router.get('/orders/:id/payment-proof',        getPaymentProof);

/* Products */
router.get('/products',       getAdminProducts);
router.post('/products',      createProduct);
router.patch('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);

export default router;
