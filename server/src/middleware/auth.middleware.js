import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import { env } from '../config/env.js';
import User from '../models/User.model.js';

// بيتأكد إن فيه توكن صحيح (من الـ cookie أو الـ Authorization header) قبل ما يسمح بالدخول
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies?.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('غير مسموح، لازم تسجلي دخول الأول');
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret);
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      res.status(401);
      throw new Error('المستخدم مش موجود أو الحساب معطل');
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('التوكن غير صحيح أو منتهي الصلاحية');
  }
});

// لازم يتحط بعد protect - بيسمح بس للأدمن
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    res.status(403);
    throw new Error('مسموح للأدمن بس');
  }
  next();
};
