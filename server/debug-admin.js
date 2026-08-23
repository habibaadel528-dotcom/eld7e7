/**
 * Debug: check what's in DB for admin user
 * Run: node debug-admin.js
 */

import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './src/models/User.model.js';

async function debug() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected');

    // Find all admin users
    const admins = await User.find({ role: 'admin' }).select('+password');
    console.log(`\nFound ${admins.length} admin(s):\n`);

    for (const admin of admins) {
      console.log('Email:', admin.email);
      console.log('isActive:', admin.isActive);
      console.log('role:', admin.role);
      console.log('passwordHash:', admin.password);

      const match123admain = await bcrypt.compare('123admain', admin.password);
      const match123admin  = await bcrypt.compare('123admin',  admin.password);
      console.log('Password "123admain" matches:', match123admain);
      console.log('Password "123admin"  matches:', match123admin);
      console.log('---');
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

debug();
