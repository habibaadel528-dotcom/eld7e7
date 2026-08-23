import { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { userApi } from '../services/api';
import { getAuthToken } from '../utils/auth';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('eld7e7_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Sync from MongoDB when logged in on mount
  useEffect(() => {
    const token = getAuthToken();
    if (token) {
      userApi.getCart()
        .then((data) => {
          if (data.cart && data.cart.length > 0) {
            const formatted = data.cart.map((item) => ({
              id: item.product || item._id,
              name: item.name,
              size: item.size || 'Standard',
              color: item.color || 'Default',
              price: Number(item.price || 0),
              quantity: item.quantity,
              image: item.image || '',
            }));
            setCartItems(formatted);
          }
        })
        .catch(() => {
          // ignore auth fetch errors
        });
    }
  }, []);

  // Save to localStorage & MongoDB on changes
  useEffect(() => {
    localStorage.setItem('eld7e7_cart', JSON.stringify(cartItems));

    const token = getAuthToken();
    if (token) {
      const dbCart = cartItems.map((item) => ({
        name: item.name,
        size: item.size,
        color: item.color,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      }));
      userApi.updateCart(dbCart).catch(() => {});
    }
  }, [cartItems]);

  const addToCart = (product) => {
    if (!product) return;

    const productId = product._id || product.id || product.slug;
    const productName = product.name ?? product.title ?? 'Product';

    setCartItems((currentItems) => {
      const existingItem = currentItems.find(
        (item) => item.id === productId,
      );

      if (existingItem) {
        toast.success(`"${productName}" quantity updated`);
        return currentItems.map((item) =>
          item.id === productId
            ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
            : item,
        );
      }

      toast.success(`"${productName}" added to cart`);

      const imageUrl =
        product.image ||
        (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '') ||
        '';

      return [
        ...currentItems,
        {
          id: productId,
          name: productName,
          size: product.size ?? 'Standard',
          color: product.color ?? product.category ?? 'Default',
          price: Number(product.price || 0),
          quantity: 1,
          image: imageUrl,
        },
      ];
    });
  };

  const increaseQuantity = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.min(item.quantity + 1, 99) }
          : item,
      ),
    );
  };

  const decreaseQuantity = (itemId) => {
    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
          : item,
      ),
    );
  };

  const removeItem = (itemId) => {
    const item = cartItems.find((i) => i.id === itemId);
    setCartItems((currentItems) =>
      currentItems.filter((i) => i.id !== itemId),
    );
    if (item) toast.info(`"${item.name}" removed from cart`);
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('eld7e7_cart');
    const token = getAuthToken();
    if (token) {
      userApi.clearCart().catch(() => {});
    }
  };

  const cartCount = useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems],
  );

  const subtotal = useMemo(
    () =>
      cartItems.reduce(
        (total, item) => total + Number(item.price || 0) * item.quantity,
        0,
      ),
    [cartItems],
  );

  const value = {
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
    cartCount,
    subtotal,
  };

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
}
