import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name:     { type: String, required: true },
    price:    { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    image:    { type: String, default: '' },
  },
  { _id: false }
);

const shippingAddressSchema = new mongoose.Schema(
  {
    recipientName: { type: String, required: true },
    street:  { type: String, required: true },
    city:    { type: String, required: true },
    phone:   { type: String, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    status: {
      type: String,
      enum: ['processing', 'shipped', 'delivered', 'cancelled', 'returned'],
      default: 'processing',
    },
    totalAmount:     { type: Number, required: true },
    shippingAddress: shippingAddressSchema,

    /* ── Payment ── */
    paymentMethod: {
      type: String,
      enum: ['cash_on_delivery', 'instapay', 'vodafone_cash', 'card', 'paymob'],
      default: 'cash_on_delivery',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'pending_verification', 'paid', 'rejected'],
      default: 'pending',
    },
    paymentProof:           { type: String, default: '' },        // relative path to uploaded screenshot
    paymentVerifiedAt:      { type: Date },
    paymentVerifiedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    paymentRejectionReason: { type: String, default: '' },
  },
  { timestamps: true }
);

/* Auto-generate order number like ELD-XXXX */
orderSchema.pre('save', async function () {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `ELD-${String(count + 1).padStart(4, '0')}`;
  }
});

const Order = mongoose.model('Order', orderSchema);
export default Order;
