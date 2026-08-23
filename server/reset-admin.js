/**
 * Reset admin password directly in MongoDB
 * Run: node reset-admin.js
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.model.js';

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const email = 'admin123@gmail.com';
    const newPassword = '123admain';

    // Hash the password with the same settings as the model
    const hashed = await bcrypt.hash(newPassword, 12);

    // Use updateOne to bypass pre-save hook (directly set hashed password)
    const result = await User.updateOne(
      { email },
      {
        $set: {
          password: hashed,
          role: 'admin',
          isActive: true,
        },
      }
    );

    if (result.matchedCount === 0) {
      // Admin doesn't exist at all — create fresh
      await User.create({
        firstName: 'Admin',
        lastName: 'El-D7E7',
        email,
        password: newPassword, // pre-save hook will hash it
        role: 'admin',
        isActive: true,
      });
      console.log('✅ Admin user CREATED fresh.');
    } else {
      console.log('✅ Admin password RESET successfully.');
    }

    console.log(`\nLogin with:`);
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${newPassword}`);
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

resetAdmin();
