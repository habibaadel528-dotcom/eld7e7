import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function generateToken(userId) {
  return jwt.sign({ id: userId }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

// بيحط التوكن في cookie آمن (httpOnly) بدل ما يترسل في الـ response body بس
export function setTokenCookie(res, token) {
  const isProduction = env.nodeEnv === 'production';

  res.cookie('token', token, {
    httpOnly: true,
    secure: isProduction, // https بس وقت production
    sameSite: isProduction ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 أيام
  });
}
