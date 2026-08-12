import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  if (!env.mongodbUri) {
    console.error(
      'MONGODB_URI مش موجود في ملف .env. ضيفي الـ connection string بتاع Atlas وحاولي تاني.'
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(env.mongodbUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
}
