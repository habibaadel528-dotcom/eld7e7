import { Router } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import { uploadProof } from '../middleware/upload.middleware.js';
import { createOrder, getMyOrders, getOrderById, cancelOrder, submitPaymentProof } from '../controllers/order.controller.js';

const router = Router();

router.use(protect);

router.post('/',                                          createOrder);
router.get('/',                                           getMyOrders);
router.get('/:id',                                        getOrderById);
router.patch('/:id/cancel',                               cancelOrder);
router.post('/:id/payment-proof', uploadProof.single('proof'), submitPaymentProof);

export default router;
