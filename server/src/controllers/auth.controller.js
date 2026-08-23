import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { validationResult } from 'express-validator';
import User from '../models/User.model.js';
import { env } from '../config/env.js';
import { sendEmail } from '../services/email.service.js';

/* Helper: sign JWT */
function signToken(userId) {
  return jwt.sign({ id: userId }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });
}

/* Helper: send standardised auth response */
function sendAuthResponse(res, statusCode, user, token) {
  res.status(statusCode).json({
    success: true,
    token,
    user: {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      gender: user.gender || 'male',
      country: user.country || 'Egypt',
      language: user.language || 'english',
      loyaltyPoints: user.loyaltyPoints,
    },
  });
}

/* Helper: parse User-Agent string into structured session info */
function parseUserAgent(uaString = '') {
  const ua = uaString.toLowerCase();

  /* Device type */
  let deviceType = 'desktop';
  let deviceName = 'Desktop';
  if (/iphone/.test(ua)) { deviceType = 'smartphone'; deviceName = 'iPhone'; }
  else if (/ipad/.test(ua)) { deviceType = 'tablet'; deviceName = 'iPad'; }
  else if (/android.*mobile/.test(ua)) { deviceType = 'smartphone'; deviceName = 'Android Phone'; }
  else if (/android/.test(ua)) { deviceType = 'tablet'; deviceName = 'Android Tablet'; }
  else if (/macintosh|mac os x/.test(ua)) { deviceType = 'laptop'; deviceName = 'Mac'; }
  else if (/windows/.test(ua)) { deviceType = 'desktop'; deviceName = 'Windows PC'; }
  else if (/linux/.test(ua)) { deviceType = 'desktop'; deviceName = 'Linux PC'; }

  /* OS */
  let os = '';
  if (/windows nt 10/.test(ua)) os = 'Windows 10/11';
  else if (/windows nt 6\.3/.test(ua)) os = 'Windows 8.1';
  else if (/mac os x 10[_. ]15/.test(ua)) os = 'macOS Catalina+';
  else if (/mac os x/.test(ua)) os = 'macOS';
  else if (/android 1[0-9]/.test(ua)) os = `Android ${ua.match(/android (\d+)/)?.[1] || ''}`;
  else if (/iphone os/.test(ua)) os = `iOS ${(ua.match(/iphone os (\d+)/)?.[1] || '').replace('_','.')}`;
  else if (/linux/.test(ua)) os = 'Linux';

  /* Browser */
  let browser = 'Unknown Browser';
  if (/edg\//.test(ua)) browser = `Edge ${ua.match(/edg\/([\d.]+)/)?.[1]?.split('.')[0] || ''}`;
  else if (/opr\/|opera/.test(ua)) browser = `Opera ${ua.match(/opr\/([\d.]+)/)?.[1]?.split('.')[0] || ''}`;
  else if (/firefox\/([\d.]+)/.test(ua)) browser = `Firefox ${ua.match(/firefox\/([\d.]+)/)?.[1]?.split('.')[0] || ''}`;
  else if (/chrome\/([\d.]+)/.test(ua) && !/chromium/.test(ua)) browser = `Chrome ${ua.match(/chrome\/([\d.]+)/)?.[1]?.split('.')[0] || ''}`;
  else if (/safari\//.test(ua) && /version\/([\d.]+)/.test(ua)) browser = `Safari ${ua.match(/version\/([\d.]+)/)?.[1]?.split('.')[0] || ''}`;

  if (os) browser += ` · ${os}`;

  return { deviceType, deviceName, browser, os };
}

/* ────────────────────────────────
   POST /api/auth/register
   ──────────────────────────────── */
export async function register(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { firstName, lastName, email, password } = req.body;

    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    const user = await User.create({ firstName, lastName, email, password });
    const token = signToken(user._id);

    /* Save first session */
    const { deviceType, deviceName, browser } = parseUserAgent(req.headers['user-agent']);
    const ip = req.ip || req.connection?.remoteAddress || '';
    user.sessions.push({ token, deviceType, deviceName, browser, ip, lastActive: new Date(), isCurrent: true });
    await user.save();

    sendAuthResponse(res, 201, user, token);
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   POST /api/auth/login
   ──────────────────────────────── */
export async function login(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated.' });
    }

    const token = signToken(user._id);

    /* Parse device info from User-Agent */
    const { deviceType, deviceName, browser } = parseUserAgent(req.headers['user-agent']);
    const ip = req.ip || req.connection?.remoteAddress || '';

    /* Unmark previous isCurrent sessions, prune old (keep last 10) */
    user.sessions.forEach((s) => { s.isCurrent = false; });
    if (user.sessions.length >= 10) {
      user.sessions.splice(0, user.sessions.length - 9);
    }

    user.sessions.push({ token, deviceType, deviceName, browser, ip, lastActive: new Date(), isCurrent: true });
    await user.save();

    sendAuthResponse(res, 200, user, token);
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   GET /api/auth/me  (protected)
   ──────────────────────────────── */
export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate('wishlist', 'name price images');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role,
        gender: user.gender || 'male',
        country: user.country || 'Egypt',
        language: user.language || 'english',
        loyaltyPoints: user.loyaltyPoints,
        addresses: user.addresses,
        wishlist: user.wishlist,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   POST /api/auth/forgot-password
   ──────────────────────────────── */
export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required.' });
    }

    // Always respond 200 to prevent email enumeration (security best practice)
    const successResponse = () =>
      res.status(200).json({
        success: true,
        message: 'If an account with that email exists, a reset link has been sent.',
      });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return successResponse();
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Save hashed token + expiry (15 minutes)
    user.passwordResetToken = resetTokenHash;
    user.passwordResetExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    // Build reset URL
    const resetUrl = `${env.clientOrigin}/reset-password/${resetToken}`;

    // Send email
    const emailResult = await sendEmail({
      to: user.email,
      subject: 'Reset Your El-D7E7 Password',
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;">
          <h2 style="color:#c53938;margin-bottom:8px;">Password Reset Request</h2>
          <p style="color:#535353;">Hi ${user.firstName},</p>
          <p style="color:#535353;">We received a request to reset your password. Click the button below to set a new password. This link expires in <strong>15 minutes</strong>.</p>
          <a href="${resetUrl}" style="display:inline-block;margin:24px 0;padding:14px 28px;background:#c53938;color:#fff;font-weight:600;font-size:15px;border-radius:12px;text-decoration:none;">
            Reset Password
          </a>
          <p style="color:#888;font-size:13px;">Or copy this link: <a href="${resetUrl}" style="color:#c53938;">${resetUrl}</a></p>
          <p style="color:#888;font-size:12px;margin-top:32px;">If you didn't request this, you can safely ignore this email. Your password will not change.</p>
        </div>
      `,
      text: `Reset your El-D7E7 password by visiting: ${resetUrl}\n\nThis link expires in 15 minutes.\n\nIf you didn't request this, ignore this email.`,
    });

    if (!emailResult.success) {
      console.error('[ForgotPassword] Email delivery failed:', emailResult.error);
      // Rollback token so user can try again
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });
    }

    // Always return success — never reveal whether email exists or was sent
    return successResponse();
  } catch (error) {
    next(error);
  }
}
