/**
 * Seed script — run once to create admin user + sample products
 * Usage: node seed.js
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import User    from './src/models/User.model.js';
import Product from './src/models/Product.model.js';

const MONGO_URI = process.env.MONGODB_URI;

/* ── Admin credentials (matching the existing frontend) ── */
const ADMIN = {
  firstName: 'Admin',
  lastName:  'El-D7E7',
  email:     'admin123@gmail.com',
  password:  '123admain',   // will be hashed by the User model pre-save hook
  role:      'admin',
};

/* ── Sample products ── */
const PRODUCTS = [
  /* ── Stationery ── */
  { name: 'BIC Cristal Ballpoint Pen (Pack of 10)', description: 'Classic smooth-writing ballpoint pens, blue ink.', price: 35, originalPrice: 45, category: 'stationery', stock: 200, rating: 4.6, reviewCount: 312, images: [] },
  { name: 'Staedtler Noris HB Pencils (Pack of 12)', description: 'Premium quality HB pencils for school and office.', price: 55, originalPrice: 70, category: 'stationery', stock: 150, rating: 4.7, reviewCount: 198, images: [] },
  { name: 'A4 Spiral Notebook 200 Pages', description: 'Ruled pages, durable cover, perforated edges.', price: 85, originalPrice: 110, category: 'stationery', stock: 100, rating: 4.5, reviewCount: 87, images: [] },
  { name: 'Scotch Transparent Tape 3-Pack', description: 'Multi-purpose clear tape, easy to write on.', price: 40, originalPrice: 55, category: 'stationery', stock: 300, rating: 4.4, reviewCount: 145, images: [] },
  { name: 'Maped Scissors 17cm', description: 'Ergonomic handle, stainless steel blades.', price: 65, originalPrice: 85, category: 'stationery', stock: 80, rating: 4.3, reviewCount: 62, images: [] },

  /* ── Cultural Books ── */
  { name: 'Alef Baa — Arabic Language for Beginners', description: 'Essential introduction to Modern Standard Arabic.', price: 120, originalPrice: 160, category: 'cultural-books', stock: 60, rating: 4.8, reviewCount: 234, images: [] },
  { name: 'The Egyptian Book of the Dead', description: 'Illustrated bilingual edition (Arabic / English).', price: 250, originalPrice: 320, category: 'cultural-books', stock: 40, rating: 4.9, reviewCount: 78, images: [] },
  { name: 'Naguib Mahfouz — Cairo Trilogy (Boxed Set)', description: 'Celebrated Arabic literary masterpiece, paperback.', price: 380, originalPrice: 480, category: 'cultural-books', stock: 25, rating: 5.0, reviewCount: 411, images: [] },

  /* ── School Books ── */
  { name: 'Grade 7 Mathematics Textbook — Ministry Edition', description: 'Official Egyptian Ministry of Education edition.', price: 70, originalPrice: 90, category: 'school-books', stock: 120, rating: 4.2, reviewCount: 55, images: [] },
  { name: 'Grade 10 Science (Biology + Chemistry) Workbook', description: 'Full curriculum coverage with practice exercises.', price: 95, originalPrice: 125, category: 'school-books', stock: 90, rating: 4.4, reviewCount: 43, images: [] },
  { name: 'English for Egypt — Grade 5', description: 'Aligned with national curriculum, colourful illustrations.', price: 60, originalPrice: 80, category: 'school-books', stock: 140, rating: 4.1, reviewCount: 67, images: [] },

  /* ── Handcraft Supplies ── */
  { name: 'Acrylic Paint Set — 24 Colours', description: 'Professional grade, quick-dry, non-toxic.', price: 175, originalPrice: 220, category: 'handcraft', stock: 70, rating: 4.7, reviewCount: 189, images: [] },
  { name: 'Canvas Board Set (30x40cm) — Pack of 5', description: 'Triple-primed cotton canvas boards, ready to paint.', price: 130, originalPrice: 170, category: 'handcraft', stock: 50, rating: 4.5, reviewCount: 96, images: [] },
  { name: 'Polymer Clay Set — 32 Colours', description: 'Oven-bake clay, soft and flexible before baking.', price: 210, originalPrice: 280, category: 'handcraft', stock: 45, rating: 4.6, reviewCount: 73, images: [] },
  { name: 'Knitting Needle Set — 18 Sizes', description: 'Stainless steel, smooth tips, with storage case.', price: 145, originalPrice: 195, category: 'handcraft', stock: 60, rating: 4.4, reviewCount: 52, images: [] },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    /* ── Upsert admin user ── */
    const existingAdmin = await User.findOne({ email: ADMIN.email });
    if (existingAdmin) {
      console.log('ℹ️  Admin already exists — skipping user creation.');
    } else {
      await User.create(ADMIN);
      console.log(`✅ Admin user created: ${ADMIN.email} / ${ADMIN.password}`);
    }

    /* ── Seed products (skip if any exist) ── */
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      console.log(`ℹ️  ${productCount} products already in DB — skipping product seed.`);
    } else {
      await Product.insertMany(PRODUCTS);
      console.log(`✅ ${PRODUCTS.length} sample products inserted.`);
    }

    console.log('\n🎉 Seed complete!');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

seed();
