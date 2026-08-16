// سكريبت لملء الداتا بيز بمنتجات تجريبية عشان نختبر الـ API بسرعة.
// تشغيله: npm run seed  (من جوا مجلد server)
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import Product from '../models/Product.model.js';

// ملحوظة: الصور هنا لينكات مؤقتة (placeholder) عشان نختبر بسرعة.
// لما نوصل لمرحلة رفع صور المنتجات الحقيقية، هنستبدلها بروابط حقيقية.
const sampleProducts = [
  {
    name: 'Roto Pen',
    slug: 'roto-pen',
    category: 'Stationery',
    subCategory: 'Pens',
    image: 'https://placehold.co/400x400?text=Roto+Pen',
    color: 'blue',
    price: 12.85,
    oldPrice: 15,
    stock: 40,
    rating: 4,
  },
  {
    name: 'Faber-Castell Eraser',
    slug: 'faber-castell-eraser',
    category: 'Stationery',
    subCategory: 'Erasers',
    image: 'https://placehold.co/400x400?text=Eraser',
    color: 'green',
    price: 5.85,
    oldPrice: 10,
    stock: 60,
    rating: 4,
  },
  {
    name: 'Double A Paper',
    slug: 'double-a-paper',
    category: 'Stationery',
    subCategory: 'Papers',
    image: 'https://placehold.co/400x400?text=Paper',
    color: 'blue',
    price: 195,
    oldPrice: 210,
    stock: 25,
    rating: 4,
  },
  {
    name: 'File Product',
    slug: 'file-product',
    category: 'Stationery',
    subCategory: 'Files',
    image: 'https://placehold.co/400x400?text=File',
    color: 'red',
    price: 40,
    oldPrice: 45,
    stock: 0,
    rating: 4,
  },
  {
    name: 'Fi Qalbi Ontha Ebriya',
    slug: 'fi-qalbi-ontha-ebriya',
    category: 'Cultural Books',
    image: 'https://placehold.co/400x400?text=Book',
    price: 122.85,
    oldPrice: 124.8,
    stock: 15,
    rating: 4,
  },
  {
    name: 'Qisas Min Al-Hikma',
    slug: 'qisas-min-al-hikma',
    category: 'Cultural Books',
    image: 'https://placehold.co/400x400?text=Book+2',
    price: 130.5,
    oldPrice: 135,
    stock: 12,
    rating: 4.2,
  },
  {
    name: 'Handcraft Yarn Set',
    slug: 'handcraft-yarn-set',
    category: 'Handcraft Supplies',
    image: 'https://placehold.co/400x400?text=Yarn',
    price: 85,
    oldPrice: 95,
    stock: 20,
    rating: 4.5,
  },
  {
    name: 'Grade 3 Math Book',
    slug: 'grade-3-math-book',
    category: 'School Books',
    image: 'https://placehold.co/400x400?text=Math+Book',
    price: 60,
    oldPrice: 65,
    stock: 30,
    rating: 4.1,
  },
];

async function seed() {
  await mongoose.connect(env.mongodbUri);
  console.log('MongoDB connected, بدء عملية الـ seeding...');

  await Product.deleteMany({});
  await Product.insertMany(sampleProducts);

  console.log(`تم إضافة ${sampleProducts.length} منتج بنجاح.`);
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error('حصل خطأ أثناء الـ seeding:', error);
  process.exit(1);
});
