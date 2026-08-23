import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { userApi } from '../services/api';
import { getAuthToken } from '../utils/auth';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch wishlist on mount if user is logged in
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      setLoading(true);
      userApi.getWishlist()
        .then((data) => {
          if (data.wishlist) {
            setWishlistItems(data.wishlist);
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, []);

  // Check if a product is in the wishlist
  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlistItems.some((item) => {
      const id = typeof item === 'string' ? item : (item._id || item.id);
      return id === productId;
    });
  };

  // Toggle wishlist item
  const toggleWishlist = async (product) => {
    if (!product) return;
    const productId = product._id || product.id || product.slug;
    const productName = product.name ?? product.title ?? 'Product';
    const token = getAuthToken();

    const currentlyInWishlist = isInWishlist(productId);

    // Optimistic UI update
    if (currentlyInWishlist) {
      setWishlistItems((prev) =>
        prev.filter((item) => {
          const id = typeof item === 'string' ? item : (item._id || item.id);
          return id !== productId;
        })
      );
      toast.info(`"${productName}" removed from wishlist`);
    } else {
      setWishlistItems((prev) => [...prev, product]);
      toast.success(`"${productName}" added to wishlist`);
    }

    // Backend sync if logged in
    if (token) {
      try {
        if (currentlyInWishlist) {
          const data = await userApi.removeFromWishlist(productId);
          if (data.wishlist) setWishlistItems(data.wishlist);
        } else {
          const data = await userApi.addToWishlist(productId);
          if (data.wishlist) setWishlistItems(data.wishlist);
        }
      } catch (err) {
        console.error('Wishlist sync error:', err);
        toast.error('Failed to update wishlist. Please try again.');
      }
    }
  };

  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  const value = {
    wishlistItems,
    isInWishlist,
    toggleWishlist,
    wishlistCount,
    loading,
    setWishlistItems,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
