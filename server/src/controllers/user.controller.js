import { validationResult } from 'express-validator';
import User from '../models/User.model.js';
import Product from '../models/Product.model.js';

/* ────────────────────────────────
   GET /api/users/profile
   ──────────────────────────────── */
export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   PATCH /api/users/profile
   ──────────────────────────────── */
export async function updateProfile(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { firstName, lastName, email, gender, country, language } = req.body;
    const updates = {};
    if (firstName !== undefined) updates.firstName = firstName.trim();
    if (lastName !== undefined)  updates.lastName  = lastName.trim();
    if (email !== undefined)     updates.email     = email.toLowerCase().trim();
    if (gender !== undefined)    updates.gender    = gender;
    if (country !== undefined)   updates.country   = country;
    if (language !== undefined)  updates.language  = language;

    /* Check email uniqueness */
    if (email) {
      const existing = await User.findOne({ email: updates.email, _id: { $ne: req.user._id } });
      if (existing) {
        return res.status(409).json({ success: false, message: 'Email is already in use.' });
      }
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true }).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   PATCH /api/users/password
   ──────────────────────────────── */
export async function updatePassword(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully.' });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   DELETE /api/users/account
   ──────────────────────────────── */
export async function deleteAccount(req, res, next) {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required to confirm account deletion.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Account deletion cancelled.' });
    }

    await User.findByIdAndDelete(req.user._id);

    res.json({ success: true, message: 'Account deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   GET /api/users/addresses
   ──────────────────────────────── */
export async function getAddresses(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('addresses');
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   POST /api/users/addresses
   ──────────────────────────────── */
export async function addAddress(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: errors.array()[0].msg });
    }

    const { label, recipientName, street, city, phone, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    /* If marked as default, unset all others */
    if (isDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
    }

    user.addresses.push({ label, recipientName, street, city, phone, isDefault: isDefault || user.addresses.length === 0 });
    await user.save();

    res.status(201).json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   PATCH /api/users/addresses/:id
   ──────────────────────────────── */
export async function updateAddress(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    const { label, recipientName, street, city, phone, isDefault } = req.body;

    if (label !== undefined)         address.label         = label;
    if (recipientName !== undefined) address.recipientName = recipientName;
    if (street !== undefined)        address.street        = street;
    if (city !== undefined)          address.city          = city;
    if (phone !== undefined)         address.phone         = phone;

    if (isDefault) {
      user.addresses.forEach((a) => { a.isDefault = false; });
      address.isDefault = true;
    }

    await user.save();
    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   DELETE /api/users/addresses/:id
   ──────────────────────────────── */
export async function deleteAddress(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.id);

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found.' });
    }

    address.deleteOne();
    await user.save();

    res.json({ success: true, addresses: user.addresses });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   GET /api/users/wishlist
   ──────────────────────────────── */
export async function getWishlist(req, res, next) {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    res.json({ success: true, wishlist: user.wishlist || [] });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   POST /api/users/wishlist/:productId
   ──────────────────────────────── */
export async function addToWishlist(req, res, next) {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    const user = await User.findById(req.user._id);
    if (user.wishlist.includes(productId)) {
      return res.status(409).json({ success: false, message: 'Product already in wishlist.' });
    }

    user.wishlist.push(productId);
    await user.save();
    await user.populate('wishlist');

    res.json({ success: true, message: 'Added to wishlist.', wishlist: user.wishlist });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   DELETE /api/users/wishlist/:productId
   ──────────────────────────────── */
export async function removeFromWishlist(req, res, next) {
  try {
    const { productId } = req.params;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { wishlist: productId } },
      { new: true }
    ).populate('wishlist');

    res.json({ success: true, message: 'Removed from wishlist.', wishlist: user.wishlist || [] });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   GET /api/users/cart
   ──────────────────────────────── */
export async function getCart(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('cart');
    res.json({ success: true, cart: user.cart || [] });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   PUT /api/users/cart (Sync whole cart array)
   ──────────────────────────────── */
export async function updateCart(req, res, next) {
  try {
    const { cart } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { cart: cart || [] },
      { new: true, runValidators: true }
    ).select('cart');

    res.json({ success: true, cart: user.cart });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   DELETE /api/users/cart (Empty user cart)
   ──────────────────────────────── */
export async function clearCart(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user._id, { cart: [] });
    res.json({ success: true, message: 'Cart cleared successfully.' });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   GET /api/users/sessions
   ──────────────────────────────── */
export async function getSessions(req, res, next) {
  try {
    const user = await User.findById(req.user._id).select('sessions');

    /* Mark the current request's token as isCurrent */
    const currentToken = req.headers.authorization?.split(' ')[1];
    const sessions = (user.sessions || []).map((s) => ({
      id: s._id,
      deviceName: s.deviceName,
      deviceType: s.deviceType,
      browser: s.browser,
      ip: s.ip,
      lastActive: s.lastActive,
      isCurrent: s.token === currentToken,
    })).sort((a, b) => b.isCurrent - a.isCurrent || new Date(b.lastActive) - new Date(a.lastActive));

    res.json({ success: true, sessions });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   DELETE /api/users/sessions/:id
   ──────────────────────────────── */
export async function revokeSession(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const session = user.sessions.id(req.params.id);

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    /* Prevent revoking current session from this endpoint */
    const currentToken = req.headers.authorization?.split(' ')[1];
    if (session.token === currentToken) {
      return res.status(400).json({ success: false, message: 'Cannot revoke current session. Use logout instead.' });
    }

    session.deleteOne();
    await user.save();

    res.json({ success: true, message: 'Session revoked.' });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   DELETE /api/users/sessions  (revoke all OTHER sessions)
   ──────────────────────────────── */
export async function revokeAllSessions(req, res, next) {
  try {
    const user = await User.findById(req.user._id);
    const currentToken = req.headers.authorization?.split(' ')[1];

    /* Keep only the current session */
    user.sessions = user.sessions.filter((s) => s.token === currentToken);
    await user.save();

    res.json({ success: true, message: 'All other sessions have been revoked.' });
  } catch (error) {
    next(error);
  }
}

