import { Router } from 'express';
import { body } from 'express-validator';
import { protect } from '../middleware/auth.middleware.js';
import {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getCart,
  updateCart,
  clearCart,
  getSessions,
  revokeSession,
  revokeAllSessions,
} from '../controllers/user.controller.js';

const router = Router();

/* All user routes require auth */
router.use(protect);

/* Profile */
router.get('/profile',   getProfile);
router.patch('/profile', [
  body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty.'),
  body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty.'),
  body('email').optional().isEmail().withMessage('Enter a valid email.').normalizeEmail(),
], updateProfile);

/* Password */
router.patch('/password', [
  body('currentPassword').notEmpty().withMessage('Current password is required.'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters.'),
], updatePassword);

/* Account Deletion */
router.delete('/account', [
  body('password').notEmpty().withMessage('Password is required to confirm deletion.'),
], deleteAccount);

/* Addresses */
router.get('/addresses',           getAddresses);
router.post('/addresses', [
  body('recipientName').trim().notEmpty().withMessage('Recipient name is required.'),
  body('street').trim().notEmpty().withMessage('Street is required.'),
  body('city').trim().notEmpty().withMessage('City is required.'),
  body('phone').trim().notEmpty().withMessage('Phone is required.'),
], addAddress);
router.patch('/addresses/:id',  updateAddress);
router.delete('/addresses/:id', deleteAddress);

/* Wishlist */
router.get('/wishlist',                    getWishlist);
router.post('/wishlist/:productId',        addToWishlist);
router.delete('/wishlist/:productId',      removeFromWishlist);

/* Cart */
router.get('/cart',    getCart);
router.put('/cart',    updateCart);
router.delete('/cart', clearCart);

/* Sessions */
router.get('/sessions',          getSessions);
router.delete('/sessions',       revokeAllSessions);
router.delete('/sessions/:id',   revokeSession);

export default router;
