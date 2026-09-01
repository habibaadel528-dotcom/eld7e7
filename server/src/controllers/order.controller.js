import Order from '../models/Order.model.js';
import User from '../models/User.model.js';
import { sendOrderNotificationEmail } from '../services/email.service.js';

const MANUAL_PAYMENT_METHODS = ['instapay', 'vodafone_cash'];

/* ────────────────────────────────
   POST /api/orders   (place order)
   ──────────────────────────────── */
export async function createOrder(req, res, next) {
  try {
    const { items, shippingAddress, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item.' });
    }

    if (!shippingAddress?.recipientName || !shippingAddress?.street || !shippingAddress?.city || !shippingAddress?.phone) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required.' });
    }

    const isManualPayment = MANUAL_PAYMENT_METHODS.includes(paymentMethod);

    const sanitizedItems = items.map((item) => {
      const rawId = item.product || item.productId || item.id || item._id;
      const isValidObjectId =
        rawId &&
        typeof rawId === 'string' &&
        /^[0-9a-fA-F]{24}$/.test(rawId);

      return {
        product: isValidObjectId ? rawId : null,
        productId: rawId ? String(rawId) : '',
        name: item.name || 'Product',
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
        image: item.image || '',
      };
    });

    const order = await Order.create({
      user: req.user._id,
      items: sanitizedItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'cash_on_delivery',
      paymentStatus: isManualPayment ? 'pending_verification' : 'pending',
      totalAmount,
    });

    /* Award loyalty points (1 pt per EGP 10 spent) */
    const pointsEarned = Math.floor(totalAmount / 10);
    if (pointsEarned > 0) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { loyaltyPoints: pointsEarned } });
    }

    /* For COD: send confirmation email immediately
       For manual payments: email is sent after admin approves */
    if (!isManualPayment) {
      User.findById(req.user._id)
        .select('firstName lastName email')
        .then((user) => {
          if (user) return sendOrderNotificationEmail({ order, user, type: 'confirmed' });
        })
        .catch((err) => {
          console.error('[createOrder] Background email dispatch error:', err.message);
        });
    }

    res.status(201).json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   POST /api/orders/:id/payment-proof
   ──────────────────────────────── */
export async function submitPaymentProof(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (!MANUAL_PAYMENT_METHODS.includes(order.paymentMethod)) {
      return res.status(400).json({ success: false, message: 'Payment proof is only required for InstaPay and Vodafone Cash orders.' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'This order has already been verified and paid.' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a payment screenshot (JPG, JPEG, or PNG).' });
    }

    /* Store relative path — never expose full server path */
    const relativePath = `payment-proofs/${req.file.filename}`;
    order.paymentProof = relativePath;
    order.paymentStatus = 'pending_verification';
    await order.save();

    res.json({
      success: true,
      message: 'Your payment proof has been submitted successfully. Your order is currently under review. We\'ll notify you once your payment is verified.',
      order,
    });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   GET /api/orders   (user's orders)
   ──────────────────────────────── */
export async function getMyOrders(req, res, next) {
  try {
    const page  = Math.max(1, Number(req.query.page)  || 1);
    const limit = Math.min(50, Number(req.query.limit) || 10);
    const skip  = (page - 1) * limit;

    const filter = { user: req.user._id };
    if (req.query.status && req.query.status !== 'all') {
      filter.status = req.query.status;
    }

    const [orders, total, statusAgg] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
      Order.aggregate([
        { $match: { user: req.user._id } },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
    ]);

    const counts = {
      all: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
      returned: 0,
    };

    statusAgg.forEach((sc) => {
      if (counts[sc._id] !== undefined) {
        counts[sc._id] = sc.count;
      }
      counts.all += sc.count;
    });

    res.json({
      success: true,
      orders,
      statusCounts: counts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   GET /api/orders/:id
   ──────────────────────────────── */
export async function getOrderById(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }
    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   PATCH /api/orders/:id/cancel
   ──────────────────────────────── */
export async function cancelOrder(req, res, next) {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    if (!['processing'].includes(order.status)) {
      return res.status(400).json({ success: false, message: 'Only processing orders can be cancelled.' });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}
