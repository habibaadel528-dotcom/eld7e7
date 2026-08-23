import Product from '../models/Product.model.js';

/* ────────────────────────────────
   GET /api/products
   Query: category, search, page, limit
   ──────────────────────────────── */
export async function getProducts(req, res, next) {
  try {
    const page     = Math.max(1, Number(req.query.page)  || 1);
    const limit    = Math.min(100, Number(req.query.limit) || 20);
    const skip     = (page - 1) * limit;
    const category = req.query.category;
    const search   = req.query.search?.trim();

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (search)   filter.$text    = { $search: search };

    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Product.countDocuments(filter),
    ]);

    res.json({
      success: true,
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    next(error);
  }
}

/* ────────────────────────────────
   GET /api/products/:id
   ──────────────────────────────── */
export async function getProductById(req, res, next) {
  try {
    const product = await Product.findOne({ _id: req.params.id, isActive: true });
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
}
