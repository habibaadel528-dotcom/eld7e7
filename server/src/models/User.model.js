import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: 'Home' },
    recipientName: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    phone: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true }
);

const cartItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: { type: String },
    size: { type: String, default: 'Standard' },
    color: { type: String, default: 'Default' },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1, min: 1 },
    image: { type: String, default: '' },
  },
  { _id: true }
);
const sessionSchema = new mongoose.Schema(
  {
    token:       { type: String, required: true },
    deviceName:  { type: String, default: 'Unknown Device' },
    deviceType:  { type: String, default: 'desktop' },   // desktop | laptop | smartphone | tablet
    browser:     { type: String, default: 'Unknown Browser' },
    os:          { type: String, default: '' },
    ip:          { type: String, default: '' },
    lastActive:  { type: Date, default: Date.now },
    isCurrent:   { type: Boolean, default: false },
  },
  { _id: true }
);


const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: true, minlength: 8 },
    role:      { type: String, enum: ['user', 'admin'], default: 'user' },
    gender:    { type: String, enum: ['male', 'female', 'other'], default: 'male' },
    country:   { type: String, default: 'Egypt' },
    language:  { type: String, default: 'english' },
    addresses: [addressSchema],
    cart:      [cartItemSchema],
    wishlist:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    loyaltyPoints: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    sessions: [sessionSchema],
    passwordResetToken:   { type: String, select: false },
    passwordResetExpires: { type: Date,   select: false },
  },
  { timestamps: true }
);

/* Hash password before save */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

/* Compare plain password with hash */
userSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

/* Strip sensitive fields from JSON output */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
