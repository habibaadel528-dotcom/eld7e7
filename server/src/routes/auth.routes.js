import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, getMe, forgotPassword } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

/* Validation rules */
const registerValidation = [
  body('firstName').trim().notEmpty().withMessage('First name is required.'),
  body('lastName').trim().notEmpty().withMessage('Last name is required.'),
  body('email').isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters.'),
];

const loginValidation = [
  body('email').isEmail().withMessage('Enter a valid email address.').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required.'),
];

router.post('/register',        registerValidation, register);
router.post('/login',           loginValidation,    login);
router.get('/me',               protect,            getMe);
router.post('/forgot-password',                     forgotPassword);

export default router;
