import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'اسم المنتج مطلوب'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      default: '',
    },
    // القسم الرئيسي: Stationery, Cultural Books, Handcraft Supplies, School Books
    category: {
      type: String,
      required: [true, 'قسم المنتج مطلوب'],
      trim: true,
      index: true,
    },
    // القسم الفرعي: Pens, Erasers, Papers, Files, Rules, Pencils...
    subCategory: {
      type: String,
      trim: true,
      default: '',
    },
    image: {
      type: String,
      required: [true, 'صورة المنتج مطلوبة'],
    },
    images: [{ type: String }],
    color: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'سعر المنتج مطلوب'],
      min: 0,
    },
    oldPrice: {
      type: Number,
      min: 0,
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

// بيحسب حالة التوفر تلقائيًا بناءً على الكمية، عشان يطابق شكل الـ status (in/out/soon) في الفرونت
productSchema.virtual('status').get(function status() {
  if (this.stock === 0) return 'out';
  if (this.stock <= 5) return 'soon';
  return 'in';
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

productSchema.index({ name: 'text', description: 'text' });

export default mongoose.model('Product', productSchema);
