import asyncHandler from 'express-async-handler';

// @route   POST /api/upload
// @access  Admin only
// @note    multer-storage-cloudinary يرفع الصورة مباشرة إلى Cloudinary
//          ويضع الـ URL الدائم في req.file.path
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('لازم تختاري صورة');
  }

  // multer-storage-cloudinary يضع الـ secure_url (https) في req.file.path
  const imageUrl = req.file.path;

  res.status(201).json({
    success: true,
    data: { url: imageUrl },
  });
});
