import asyncHandler from 'express-async-handler';

// @route   POST /api/upload
// @access  Admin only
export const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('لازم تختاري صورة');
  }

  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    data: { url: fileUrl },
  });
});
