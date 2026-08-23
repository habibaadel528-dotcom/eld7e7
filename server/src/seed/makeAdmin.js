// سكريبت بيحوّل مستخدم موجود بالفعل لـ role: admin عن طريق الإيميل بتاعه.
// تشغيله من جوا مجلد server:
//   node src/seed/makeAdmin.js you@example.com

import mongoose from 'mongoose';
import { env } from '../config/env.js';
import User from '../models/User.model.js';

const email = process.argv[2];

if (!email) {
  console.error('لازم تكتبي الإيميل بعد اسم السكريبت، مثال:');
  console.error('  node src/seed/makeAdmin.js you@example.com');
  process.exit(1);
}

async function run() {
  await mongoose.connect(env.mongodbUri);

  const user = await User.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { role: 'admin' },
    { new: true }
  );

  if (!user) {
    console.error(`مفيش يوزر بالإيميل ده: ${email}`);
  } else {
    console.log(`تم! ${user.email} بقى role: ${user.role}`);
  }

  await mongoose.disconnect();
}

run();
