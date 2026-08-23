/**
 * Order Email HTML & Text Template Generator
 * Supports multiple lifecycle stages:
 * - confirmed (default upon checkout)
 * - processing
 * - shipped
 * - out_for_delivery
 * - delivered
 * - cancelled
 */

const STATUS_CONFIG = {
  confirmed: {
    badge: 'Order Confirmed',
    badgeBg: '#e6f4ea',
    badgeColor: '#137333',
    title: 'Your order has been confirmed!',
    description: 'Thank you for shopping with El-D7E7! We’ve received your order and our team will start preparing your items shortly.',
    color: '#c53938',
  },
  processing: {
    badge: 'Processing',
    badgeBg: '#fef7e0',
    badgeColor: '#b06000',
    title: 'Your order is being prepared',
    description: 'Great news! We are actively picking, packing, and preparing your order for shipment.',
    color: '#b06000',
  },
  shipped: {
    badge: 'Shipped',
    badgeBg: '#e8f0fe',
    badgeColor: '#1a73e8',
    title: 'Your order has been shipped!',
    description: 'Your package is on its way. Track your shipment or view order details below.',
    color: '#1a73e8',
  },
  out_for_delivery: {
    badge: 'Out for Delivery',
    badgeBg: '#e8f0fe',
    badgeColor: '#1a73e8',
    title: 'Your order is out for delivery',
    description: 'Your package is out for delivery today. Please make sure someone is available at the delivery address.',
    color: '#1a73e8',
  },
  delivered: {
    badge: 'Delivered',
    badgeBg: '#e6f4ea',
    badgeColor: '#137333',
    title: 'Your order has been delivered!',
    description: 'Your package has been successfully delivered. We hope you enjoy your purchase!',
    color: '#137333',
  },
  cancelled: {
    badge: 'Cancelled',
    badgeBg: '#fce8e6',
    badgeColor: '#c5221f',
    title: 'Your order has been cancelled',
    description: 'This order has been cancelled. If you have already paid, a refund has been initiated to your original payment method.',
    color: '#c5221f',
  },
  payment_rejected: {
    badge: 'Payment Rejected',
    badgeBg: '#fce8e6',
    badgeColor: '#c5221f',
    title: 'Your payment proof was rejected',
    description: 'Unfortunately, we could not verify your payment screenshot. Please re-upload a clear and valid payment proof so we can process your order.',
    color: '#c5221f',
  },
};

export function formatEGP(amount = 0) {
  return `EGP ${Number(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function generateOrderEmail({ order, user, type = 'confirmed', clientOrigin = 'http://localhost:5173' }) {
  const config = STATUS_CONFIG[type] || STATUS_CONFIG.confirmed;
  const orderNumber = order.orderNumber || `ELD-${String(order._id).slice(-6).toUpperCase()}`;
  const customerName = user?.firstName
    ? `${user.firstName} ${user.lastName || ''}`.trim()
    : order.shippingAddress?.recipientName || 'Valued Customer';

  const orderUrl = `${clientOrigin}/account/orders`;
  const items = order.items || [];
  const address = order.shippingAddress || {};

  const itemsHtml = items
    .map((item) => {
      const imgUrl = item.image || `${clientOrigin}/assets/file-product.png`;
      const itemTotal = (item.price || 0) * (item.quantity || 1);
      return `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #f0f0f0;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="64" style="vertical-align: top; padding-right: 16px;">
                  <img
                    src="${imgUrl}"
                    alt="${item.name}"
                    width="64"
                    height="64"
                    style="display: block; border-radius: 10px; object-fit: cover; background-color: #f7f7f7; border: 1px solid #eaeaea;"
                  />
                </td>
                <td style="vertical-align: middle;">
                  <div style="font-size: 14px; font-weight: 600; color: #1e1e1e; line-height: 1.3;">
                    ${item.name}
                  </div>
                  <div style="font-size: 12px; color: #757575; margin-top: 4px;">
                    Qty: <strong style="color: #333;">${item.quantity}</strong> × ${formatEGP(item.price)}
                  </div>
                </td>
                <td align="right" style="vertical-align: middle; font-size: 14px; font-weight: 700; color: #1e1e1e; white-space: nowrap;">
                  ${formatEGP(itemTotal)}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      `;
    })
    .join('');

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${config.title} - ${orderNumber}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f5f7;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      color: #1e1e1e;
    }
    table {
      border-collapse: collapse;
    }
    img {
      border: 0;
      outline: none;
      text-decoration: none;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
        border-radius: 0 !important;
      }
      .content-padding {
        padding: 24px 18px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 30px 10px; background-color: #f4f5f7;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" class="container" width="580" cellpadding="0" cellspacing="0" border="0" style="max-width: 580px; width: 100%; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06); border: 1px solid #eaeaea;">
          
          <!-- Top Header Strip -->
          <tr>
            <td style="background-color: #1a1a1a; padding: 22px 32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <span style="font-size: 20px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">
                      El-D<span style="color: #c53938;">7</span>E<span style="color: #c53938;">7</span>
                    </span>
                  </td>
                  <td align="right" style="vertical-align: middle;">
                    <span style="font-size: 11px; font-weight: 700; color: #a0a0a0; text-transform: uppercase; letter-spacing: 1px;">
                      ORDER #${orderNumber}
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Status Body -->
          <tr>
            <td class="content-padding" style="padding: 36px 32px 28px 32px;">
              
              <!-- Status Pill -->
              <div style="display: inline-block; padding: 5px 14px; border-radius: 30px; background-color: ${config.badgeBg}; color: ${config.badgeColor}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px;">
                ${config.badge}
              </div>

              <!-- Main Title -->
              <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800; color: #111111; letter-spacing: -0.5px; line-height: 1.25;">
                ${config.title}
              </h1>

              <!-- Greeting & Description -->
              <p style="margin: 0 0 8px 0; font-size: 15px; color: #2c2c2c; font-weight: 600;">
                Hi ${customerName},
              </p>
              <p style="margin: 0 0 28px 0; font-size: 14px; color: #555555; line-height: 1.6;">
                ${config.description}
              </p>

              ${type === 'payment_rejected' && order.paymentRejectionReason ? `
              <!-- Rejection Reason Box -->
              <div style="margin: -14px 0 28px 0; padding: 14px 18px; background-color: #fce8e6; border-radius: 12px; border-left: 4px solid #c5221f;">
                <div style="font-size: 11px; font-weight: 700; color: #c5221f; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Rejection Reason</div>
                <div style="font-size: 13px; color: #7f1d1d; line-height: 1.5;">${order.paymentRejectionReason}</div>
              </div>
              ` : ''}

              <!-- CTA Button -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom: 32px;">
                <tr>
                  <td align="left">
                    <a
                      href="${orderUrl}"
                      target="_blank"
                      style="display: inline-block; background-color: #c53938; color: #ffffff; font-size: 14px; font-weight: 700; text-decoration: none; padding: 14px 28px; border-radius: 30px; box-shadow: 0 3px 12px rgba(197, 57, 56, 0.35); text-align: center;"
                    >
                      View Your Order
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <div style="height: 1px; background-color: #eeeeee; margin-bottom: 24px;"></div>

              <!-- Order Items Section -->
              <div style="font-size: 13px; font-weight: 700; color: #888888; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px;">
                Order Summary
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${itemsHtml}
              </table>

              <!-- Totals Breakdown -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 18px; padding-top: 14px;">
                <tr>
                  <td style="font-size: 13px; color: #666666; padding: 4px 0;">Subtotal</td>
                  <td align="right" style="font-size: 13px; font-weight: 600; color: #1e1e1e; padding: 4px 0;">
                    ${formatEGP(order.totalAmount)}
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 13px; color: #666666; padding: 4px 0;">Shipping</td>
                  <td align="right" style="font-size: 13px; font-weight: 600; color: #137333; padding: 4px 0;">
                    Free
                  </td>
                </tr>
                <tr>
                  <td style="font-size: 16px; font-weight: 800; color: #111111; padding: 12px 0 0 0; border-top: 2px solid #f0f0f0;">
                    Total Amount
                  </td>
                  <td align="right" style="font-size: 18px; font-weight: 800; color: #c53938; padding: 12px 0 0 0; border-top: 2px solid #f0f0f0;">
                    ${formatEGP(order.totalAmount)}
                  </td>
                </tr>
              </table>

              <!-- Shipping Address Details Card -->
              <div style="margin-top: 28px; padding: 18px 20px; background-color: #f9fafb; border-radius: 14px; border: 1px solid #eaeaea;">
                <div style="font-size: 12px; font-weight: 700; color: #666666; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px;">
                  Delivery Address
                </div>
                <div style="font-size: 13px; font-weight: 600; color: #1e1e1e; line-height: 1.4;">
                  ${address.recipientName || customerName}<br />
                  <span style="font-weight: 400; color: #555555;">${address.street || ''}, ${address.city || ''}</span><br />
                  <span style="font-weight: 400; color: #777777;">Phone: ${address.phone || 'N/A'}</span>
                </div>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; padding: 24px 32px; border-top: 1px solid #eeeeee; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 13px; color: #555555; font-weight: 500;">
                Need help with your order? <a href="mailto:support@eld7e7.com" style="color: #c53938; text-decoration: none; font-weight: 600;">Contact our support team</a>.
              </p>
              <p style="margin: 0; font-size: 11px; color: #999999;">
                &copy; ${new Date().getFullYear()} El-D7E7 Store. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  const text = `
${config.title} (Order #${orderNumber})

Hi ${customerName},

${config.description}

ORDER SUMMARY:
${items.map((it) => `- ${it.name} (x${it.quantity}) - ${formatEGP(it.price * it.quantity)}`).join('\n')}

Total Amount: ${formatEGP(order.totalAmount)}

Delivery Address:
${address.recipientName || customerName}
${address.street || ''}, ${address.city || ''}
Phone: ${address.phone || 'N/A'}

View your order: ${orderUrl}

Need help? Contact support@eld7e7.com
  `.trim();

  return {
    subject: `${config.title} - Order #${orderNumber} | El-D7E7`,
    html,
    text,
  };
}
