import { useState, useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import WishlistToolbar from '../../components/dashboard/wishlist/WishlistToolbar';
import WishlistGrid from '../../components/dashboard/wishlist/WishlistGrid';
import { userApi } from '../../services/api';
import { useCart } from '../../context/CartContext';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { addToCart } = useCart();

  const fetchWishlist = () => {
    setLoading(true);
    userApi.getWishlist()
      .then((data) => {
        if (data.wishlist) {
          setWishlist(data.wishlist);
        }
      })
      .catch(() => toast.error('Failed to load wishlist.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      const data = await userApi.removeFromWishlist(productId);
      if (data.wishlist) {
        setWishlist(data.wishlist);
      } else {
        setWishlist((prev) => prev.filter((item) => (item._id || item.id) !== productId));
      }
    } catch (error) {
      console.error('Failed to remove item from wishlist:', error);
      toast.error('Failed to remove item. Please try again.');
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  const handleAddAllToCart = () => {
    const inStockItems = wishlist.filter(
      (product) => product.status !== 'out' && product.stock !== 0
    );
    if (inStockItems.length === 0) {
      toast.info('No in-stock items to add to cart.');
      return;
    }
    inStockItems.forEach((product) => addToCart(product));
    toast.success(`${inStockItems.length} item${inStockItems.length > 1 ? 's' : ''} added to cart`);
  };

  const filteredWishlist = useMemo(() => {
    let result = [...wishlist];

    // Search filter
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter((item) => {
        const name = (item.name || item.title || '').toLowerCase();
        const cat = (item.category || '').toLowerCase();
        return name.includes(q) || cat.includes(q);
      });
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.name || a.title || '').localeCompare(b.name || b.title || ''));
    }

    return result;
  }, [wishlist, search, sortBy]);

  return (
    <>
      <Helmet>
        <title>My Wishlist | El-D7E7</title>
        <meta
          name="description"
          content="Manage your saved products."
        />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <section className="space-y-6">
        <WishlistToolbar
          totalItems={wishlist.length}
          onAddAllToCart={handleAddAllToCart}
          search={search}
          onSearchChange={setSearch}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <WishlistGrid
          products={filteredWishlist}
          loading={loading}
          onRemove={handleRemove}
          onAddToCart={handleAddToCart}
        />
      </section>
    </>
  );
}