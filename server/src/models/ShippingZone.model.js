import mongoose from 'mongoose';

const shippingZoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    eta: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ShippingZone = mongoose.model('ShippingZone', shippingZoneSchema);
export default ShippingZone;
