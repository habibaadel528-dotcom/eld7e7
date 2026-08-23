import ShippingZone from '../models/ShippingZone.model.js';

/* ── GET /api/shipping-zones ── */
export async function getShippingZones(req, res, next) {
  try {
    const zones = await ShippingZone.find({ isActive: { $ne: false } }).sort({ createdAt: 1 });
    res.json({ success: true, zones });
  } catch (error) {
    next(error);
  }
}

/* ── POST /api/shipping-zones (Admin only) ── */
export async function createShippingZone(req, res, next) {
  try {
    const { name, eta, price } = req.body;
    const zone = await ShippingZone.create({ name, eta, price });
    res.status(201).json({ success: true, zone });
  } catch (error) {
    next(error);
  }
}

/* ── PATCH /api/shipping-zones/:id (Admin only) ── */
export async function updateShippingZone(req, res, next) {
  try {
    const { id } = req.params;
    const { name, eta, price } = req.body;

    const zone = await ShippingZone.findByIdAndUpdate(
      id,
      { name, eta, price },
      { new: true, runValidators: true }
    );

    if (!zone) {
      return res.status(404).json({ success: false, message: 'Shipping zone not found.' });
    }

    res.json({ success: true, zone });
  } catch (error) {
    next(error);
  }
}

/* ── DELETE /api/shipping-zones/:id (Admin only) ── */
export async function deleteShippingZone(req, res, next) {
  try {
    const { id } = req.params;
    const zone = await ShippingZone.findByIdAndDelete(id);

    if (!zone) {
      return res.status(404).json({ success: false, message: 'Shipping zone not found.' });
    }

    res.json({ success: true, message: 'Shipping zone deleted successfully.' });
  } catch (error) {
    next(error);
  }
}
