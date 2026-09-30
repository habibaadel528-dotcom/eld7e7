import { v2 as cloudinary } from 'cloudinary';
import { env } from './env.js';

cloudinary.config({
  cloud_name: env.cloudinaryCloudName,
  api_key:    env.cloudinaryApiKey,
  api_secret: env.cloudinaryApiSecret,
  secure: true, // يضمن إنشاء روابط https دائماً
});

export default cloudinary;
