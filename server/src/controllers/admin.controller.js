import User from '../models/User.model.js';
import Order from '../models/Order.model.js';
import Product from '../models/Product.model.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { sendOrderNotificationEmail } from '../services/email.service.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const paymentProofsDir = path.join(__dirname, '../../uploads/payment-proofs');

/* ────────────────────────────────
   GET /api/admin/stats
   ──────────────────────────────── */
export async function getStats(req, res, next) {
  try {
    const [totalUsers, totalOrders, totalProducts, revenueAgg] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Order.aggregate([
        { $match: { status: { $nin: ['cancelled', 'returned'] } } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRevenue: revenueAgg[0]?.total || 0,
      },
    });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   GET /api/admin/customers
   ──────────────────────────────── */
export async function getCustomers(req, res, next) {
  try {
    const page   = Math.max(1, Number(req.query.page)  || 1);
    const limit  = Math.min(100, Number(req.query.limit) || 50);
    const skip   = (page - 1) * limit;
    const search = req.query.search?.trim();

    const matchFilter = { role: 'user' };
    if (search) {
      const re = new RegExp(search, 'i');
      matchFilter.$or = [{ firstName: re }, { lastName: re }, { email: re }];
    }

    const [users, total] = await Promise.all([
      User.aggregate([
        { $match: matchFilter },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'orders',
            localField: '_id',
            foreignField: 'user',
            as: 'userOrders',
          },
        },
        {
          $project: {
            password: 0,
            firstName: 1,
            lastName: 1,
            email: 1,
            role: 1,
            isActive: 1,
            avatar: 1,
            phone: 1,
            addresses: 1,
            loyaltyPoints: 1,
            createdAt: 1,
            updatedAt: 1,
            ordersCount: { $size: '$userOrders' },
            totalSpent: {
              $sum: {
                $map: {
                  input: '$userOrders',
                  as: 'ord',
                  in: {
                    $cond: [
                      { $ne: ['$$ord.status', 'cancelled'] },
                      '$$ord.totalAmount',
                      0,
                    ],
                  },
                },
              },
            },
          },
        },
      ]),
      User.countDocuments(matchFilter),
    ]);

    res.json({
      success: true,
      customers: users,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   GET /api/admin/customers/:id
   ──────────────────────────────── */
export async function getCustomerById(req, res, next) {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Customer not found.' });

    const orders = await Order.find({ user: req.params.id }).sort({ createdAt: -1 });
    const ordersCount = orders.length;
    const totalSpent = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    res.json({
      success: true,
      customer: {
        ...user.toObject(),
        ordersCount,
        totalSpent,
        orders,
      },
    });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   PATCH /api/admin/customers/:id
   ──────────────────────────────── */
export async function updateCustomer(req, res, next) {
  try {
    const { isActive, role } = req.body;
    const updates = {};
    if (isActive !== undefined) updates.isActive = isActive;
    if (role !== undefined && ['user', 'admin'].includes(role)) updates.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'Customer not found.' });

    res.json({ success: true, customer: user });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   GET /api/admin/orders
   ──────────────────────────────── */
export async function getAllOrders(req, res, next) {
  try {
    const page   = Math.max(1, Number(req.query.page)  || 1);
    const limit  = Math.min(100, Number(req.query.limit) || 20);
    const skip   = (page - 1) * limit;
    const search = req.query.search?.trim();

    const filter = {};
    if (req.query.status && req.query.status !== 'all') filter.status = req.query.status;
    if (req.query.paymentStatus && req.query.paymentStatus !== 'all') filter.paymentStatus = req.query.paymentStatus;
    if (search) filter.orderNumber = new RegExp(search, 'i');

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('user', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({
      success: true,
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   PATCH /api/admin/orders/:id/status
   ──────────────────────────────── */
export async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ['processing', 'shipped', 'delivered', 'cancelled', 'returned'];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value.' });
    }

    const existingOrder = await Order.findById(req.params.id);
    if (!existingOrder) return res.status(404).json({ success: false, message: 'Order not found.' });

    const updateFields = { status };

    // When cash on delivery order is marked delivered, payment is collected -> set paymentStatus to 'paid'
    if (status === 'delivered' && existingOrder.paymentMethod === 'cash_on_delivery') {
      updateFields.paymentStatus = 'paid';
    }

    const order = await Order.findByIdAndUpdate(req.params.id, updateFields, { new: true })
      .populate('user', 'firstName lastName email');

    /* Dispatch status lifecycle email */
    if (order.user) {
      sendOrderNotificationEmail({
        order,
        user: order.user,
        type: status,
      }).catch((err) => console.error('[adminUpdateStatus] Email notification error:', err.message));
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   PATCH /api/admin/orders/:id/verify-payment
   Body: { action: 'approve' | 'reject', rejectionReason?: string }
   ──────────────────────────────── */
export async function verifyPayment(req, res, next) {
  try {
    const { action, rejectionReason } = req.body;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ success: false, message: "Action must be 'approve' or 'reject'." });
    }

    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (!order.paymentProof) {
      return res.status(400).json({ success: false, message: 'No payment proof has been submitted for this order yet.' });
    }

    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ success: false, message: 'This payment has already been approved.' });
    }

    if (action === 'approve') {
      order.paymentStatus = 'paid';
      order.paymentVerifiedAt = new Date();
      order.paymentVerifiedBy = req.user._id;
      order.status = 'processing';
      await order.save();

      /* Send order confirmation email */
      if (order.user) {
        sendOrderNotificationEmail({ order, user: order.user, type: 'confirmed' })
          .catch((err) => console.error('[verifyPayment] Confirmation email error:', err.message));
      }

      return res.json({ success: true, message: 'Payment approved. Order is now processing.', order });
    }

    /* reject */
    if (!rejectionReason?.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a rejection reason.' });
    }

    order.paymentStatus = 'rejected';
    order.paymentRejectionReason = rejectionReason.trim();
    await order.save();

    /* Send payment rejection notification email */
    if (order.user) {
      sendOrderNotificationEmail({ order, user: order.user, type: 'payment_rejected' })
        .catch((err) => console.error('[verifyPayment] Rejection email error:', err.message));
    }

    return res.json({ success: true, message: 'Payment rejected. Customer has been notified.', order });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   GET /api/admin/orders/:id/payment-proof
   Streams the image — admin only, never exposed publicly
   ──────────────────────────────── */
export async function getPaymentProof(req, res, next) {
  try {
    const order = await Order.findById(req.params.id).select('paymentProof');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });
    if (!order.paymentProof) return res.status(404).json({ success: false, message: 'No payment proof found for this order.' });

    const filePath = path.join(paymentProofsDir, path.basename(order.paymentProof));

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'Payment proof file not found on server.' });
    }

    res.sendFile(filePath);
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   GET /api/admin/products
   ──────────────────────────────── */
export async function getAdminProducts(req, res, next) {
  try {
    const page    = Math.max(1, Number(req.query.page)  || 1);
    const limit   = Math.min(100, Number(req.query.limit) || 20);
    const skip    = (page - 1) * limit;
    const search  = req.query.search?.trim();
    const category = req.query.category;

    const filter = { isActive: { $ne: false } };
    if (category) filter.category = category;
    if (search)   filter.$text = { $search: search };

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   POST /api/admin/products
   ──────────────────────────────── */
export async function createProduct(req, res, next) {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   PATCH /api/admin/products/:id
   ──────────────────────────────── */
export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   DELETE /api/admin/products/:id
   ──────────────────────────────── */
export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found.' });
    res.json({ success: true, message: 'Product deleted permanently.' });
  } catch (error) {
    next(error);
  }
}
