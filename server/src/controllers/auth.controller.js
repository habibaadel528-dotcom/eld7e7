import asyncHandler from 'express-async-handler';
import User from '../models/User.model.js';
import { generateToken, setTokenCookie } from '../utils/generateToken.js';

// @route   POST /api/auth/signup
export const signup = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('الاسم والإيميل وكلمة المرور مطلوبين');
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('في حساب مسجل بالإيميل ده بالفعل');
  }

  const user = await User.create({ name, email, password, phone });

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.status(201).json({
    success: true,
    data: user.toSafeObject(),
    token,
  });
});

// @route   POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('الإيميل وكلمة المرور مطلوبين');
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('الإيميل أو كلمة المرور غلط');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('الحساب ده معطل، كلمي الدعم');
  }

  const token = generateToken(user._id);
  setTokenCookie(res, token);

  res.json({
    success: true,
    data: user.toSafeObject(),
    token,
  });
});

// @route   POST /api/auth/logout
export const logout = asyncHandler(async (_req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'تم تسجيل الخروج' });
});

// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user.toSafeObject() });
});
