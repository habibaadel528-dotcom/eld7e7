import { Router } from 'express';
import {
  getShippingZones,
  createShippingZone,
  updateShippingZone,
  deleteShippingZone,
} from '../controllers/shippingZone.controller.js';
import { protect, adminOnly } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/', getShippingZones);
router.post('/', protect, adminOnly, createShippingZone);
router.patch('/:id', protect, adminOnly, updateShippingZone);
router.delete('/:id', protect, adminOnly, deleteShippingZone);

export default router;
