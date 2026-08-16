import asyncHandler from 'express-async-handler';
import Product from '../models/Product.model.js';

// @route   GET /api/products
// @desc    قائمة المنتجات مع فلترة، بحث، ترتيب، وpagination
// @query   category, subCategory, search, minPrice, maxPrice, sort, page, limit
export const getProducts = asyncHandler(async (req, res) => {
  const {
    category,
    subCategory,
    search,
    minPrice,
    maxPrice,
    sort,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = { isActive: true };

  if (category) filter.category = category;
  if (subCategory) filter.subCategory = subCategory;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (search) {
    filter.$text = { $search: search };
  }

  const sortOptions = {
    'price-asc': { price: 1 },
    'price-desc': { price: -1 },
    newest: { createdAt: -1 },
    rating: { rating: -1 },
  };
  const sortBy = sortOptions[sort] || { createdAt: -1 };

  const pageNum = Math.max(Number(page), 1);
  const limitNum = Math.min(Math.max(Number(limit), 1), 100);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(filter).sort(sortBy).skip(skip).limit(limitNum),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: products,
    pagination: {
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
      limit: limitNum,
    },
  });
});

// @route   GET /api/products/:slug
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true,
  });

  if (!product) {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }

  res.json({ success: true, data: product });
});

// @route   POST /api/products
// @access  Admin only
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json({ success: true, data: product });
});

// @route   PUT /api/products/:id
// @access  Admin only
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }

  res.json({ success: true, data: product });
});

// @route   DELETE /api/products/:id
// @access  Admin only
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('المنتج غير موجود');
  }

  res.json({ success: true, message: 'تم حذف المنتج' });
});
