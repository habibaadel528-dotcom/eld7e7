import { generateOrderEmail } from '../templates/orderEmailTemplate.js';
import { env } from '../config/env.js';

/**
 * Universal Email Delivery Service
 * Supports Resend API, SMTP (via Nodemailer), and Development Logging Fallback.
 */
export async function sendEmail({ to, subject, html, text }) {
  const from = env.emailFrom;
  const resendApiKey = env.resendApiKey;

  /* 1. If Resend API Key is set, send via Resend REST API */
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from,
          to: Array.isArray(to) ? to : [to],
          subject,
          html,
          text,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error('[EmailService] Resend API error:', data);
        return { success: false, error: data };
      }

      console.log(`[EmailService] Email sent via Resend to ${to} (ID: ${data.id})`);
      return { success: true, id: data.id, provider: 'resend' };
    } catch (err) {
      console.error('[EmailService] Resend dispatch failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  /* 2. If SMTP configuration is provided, try dynamic Nodemailer */
  const smtpHost = env.smtpHost;
  const smtpUser = env.smtpUser;
  const smtpPass = env.smtpPass;
  const smtpPort = env.smtpPort;

  if (smtpHost && smtpUser) {
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.default.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
        text,
      });

      console.log(`[EmailService] Email sent via SMTP to ${to} (MessageId: ${info.messageId})`);
      return { success: true, messageId: info.messageId, provider: 'smtp' };
    } catch (err) {
      console.error('[EmailService] SMTP dispatch failed:', err.message);
      return { success: false, error: err.message };
    }
  }

  /* 3. Fallback Development Logger */
  console.log('───────────────────────────────────────────────────────');
  console.log(`[EmailService - DEV PREVIEW]`);
  console.log(`To:      ${to}`);
  console.log(`From:    ${from}`);
  console.log(`Subject: ${subject}`);
  console.log(`Status:  Email generated successfully.`);
  console.log('───────────────────────────────────────────────────────');

  return { success: true, preview: true, provider: 'dev-preview' };
}

/**
 * Send an Order Notification Email (Confirmation, Shipped, Delivered, etc.)
 */
export async function sendOrderNotificationEmail({ order, user, type = 'confirmed' }) {
  try {
    const recipientEmail = user?.email || order.shippingAddress?.email;
    if (!recipientEmail) {
      console.warn(`[EmailService] Skipped sending order email for order ${order._id}: No customer email found.`);
      return { success: false, message: 'No recipient email available' };
    }

    const { subject, html, text } = generateOrderEmail({
      order,
      user,
      type,
      clientOrigin: env.clientOrigin || 'http://localhost:5173',
    });

    return await sendEmail({
      to: recipientEmail,
      subject,
      html,
      text,
    });
  } catch (err) {
    console.error(`[EmailService] Failed to generate/send order email for order ${order?._id}:`, err.message);
    return { success: false, error: err.message };
  }
}
