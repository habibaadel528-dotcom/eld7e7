export const API_BASE =
  import.meta.env.VITE_API_URL || 'https://eld7e7-production.up.railway.app/api';

/* ── Health check ── */
export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`);
  if (!response.ok) throw new Error(`Health check failed: ${response.status}`);
  return response.json();
}

/* ── Generic authenticated fetch helper ── */
export async function apiFetch(path, options = {}) {
  const token = localStorage.getItem('authToken');

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      const token = localStorage.getItem('authToken');
      if (token === 'temporary-demo-token' || !token) {
        localStorage.removeItem('authToken');
      }
    }
    const error = new Error(data.message || 'Something went wrong.');
    error.status = response.status;
    throw error;
  }

  return data;
}

/* ── Authenticated fetch for multipart/form-data (file uploads) ── */
export async function apiFetchFormData(path, formData) {
  const token = localStorage.getItem('authToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || 'Upload failed.');
    error.status = response.status;
    throw error;
  }
  return data;
}

/* ── Auth ── */
export const authApi = {
  register:       (body)  => apiFetch('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login:          (body)  => apiFetch('/auth/login',    { method: 'POST', body: JSON.stringify(body) }),
  me:             ()      => apiFetch('/auth/me'),
  forgotPassword: (email) => apiFetch('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
};

/* ── User ── */
export const userApi = {
  getProfile:     ()         => apiFetch('/users/profile'),
  updateProfile:  (body)     => apiFetch('/users/profile',  { method: 'PATCH', body: JSON.stringify(body) }),
  updatePassword: (body)     => apiFetch('/users/password', { method: 'PATCH', body: JSON.stringify(body) }),
  deleteAccount:  (body)     => apiFetch('/users/account',  { method: 'DELETE', body: JSON.stringify(body) }),

  getAddresses:   ()         => apiFetch('/users/addresses'),
  addAddress:     (body)     => apiFetch('/users/addresses',    { method: 'POST',   body: JSON.stringify(body) }),
  updateAddress:  (id, body) => apiFetch(`/users/addresses/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteAddress:  (id)       => apiFetch(`/users/addresses/${id}`,   { method: 'DELETE' }),

  getWishlist:        ()          => apiFetch('/users/wishlist'),
  addToWishlist:      (productId) => apiFetch(`/users/wishlist/${productId}`, { method: 'POST' }),
  removeFromWishlist: (productId) => apiFetch(`/users/wishlist/${productId}`, { method: 'DELETE' }),

  getCart:        ()     => apiFetch('/users/cart'),
  updateCart:     (cart) => apiFetch('/users/cart', { method: 'PUT', body: JSON.stringify({ cart }) }),
  clearCart:      ()     => apiFetch('/users/cart', { method: 'DELETE' }),
};

/* ── Orders ── */
export const orderApi = {
  createOrder:        (body)         => apiFetch('/orders',    { method: 'POST', body: JSON.stringify(body) }),
  getMyOrders:        (params)       => apiFetch(`/orders?${new URLSearchParams(params || {})}`),
  getOrderById:       (id)           => apiFetch(`/orders/${id}`),
  cancelOrder:        (id)           => apiFetch(`/orders/${id}/cancel`, { method: 'PATCH' }),
  submitPaymentProof: (id, formData) => apiFetchFormData(`/orders/${id}/payment-proof`, formData),
};

/* ── Products (public) ── */
export const productApi = {
  getProducts:    (params) => apiFetch(`/products?${new URLSearchParams(params || {})}`),
  getProductById: (id)     => apiFetch(`/products/${id}`),
};

/* ── Sessions ── */
export const sessionApi = {
  getSessions:       ()   => apiFetch('/users/sessions'),
  revokeSession:     (id) => apiFetch(`/users/sessions/${id}`, { method: 'DELETE' }),
  revokeAllSessions: ()   => apiFetch('/users/sessions',       { method: 'DELETE' }),
};

/* ── Admin ── */
export const adminApi = {
  getStats:           ()           => apiFetch('/admin/stats'),
  getCustomers:       (params)     => apiFetch(`/admin/customers?${new URLSearchParams(params || {})}`),
  updateCustomer:     (id, body)   => apiFetch(`/admin/customers/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  getOrders:          (params)     => apiFetch(`/admin/orders?${new URLSearchParams(params || {})}`),
  updateOrderStatus:  (id, status) => apiFetch(`/admin/orders/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  verifyPayment:      (id, body)   => apiFetch(`/admin/orders/${id}/verify-payment`, { method: 'PATCH', body: JSON.stringify(body) }),
  getPaymentProofUrl: (id)         => `${API_BASE}/admin/orders/${id}/payment-proof`,
  getProducts:        (params)     => apiFetch(`/admin/products?${new URLSearchParams(params || {})}`),
  createProduct:      (body)       => apiFetch('/admin/products',    { method: 'POST',   body: JSON.stringify(body) }),
  updateProduct:      (id, body)   => apiFetch(`/admin/products/${id}`, { method: 'PATCH', body: JSON.stringify(body) }),
  deleteProduct:      (id)         => apiFetch(`/admin/products/${id}`, { method: 'DELETE' }),
};

/* ── Upload ── */
export const uploadApi = {
  uploadImage: (file) => {
    const fd = new FormData();
    fd.append('image', file);
    return apiFetchFormData('/upload', fd);
  },
};

/* ── Shipping Zones ── */
export const shippingZoneApi = {
  getZones:   ()         => apiFetch('/shipping-zones'),
  createZone: (body)     => apiFetch('/shipping-zones',      { method: 'POST',   body: JSON.stringify(body) }),
  updateZone: (id, body) => apiFetch(`/shipping-zones/${id}`, { method: 'PATCH',  body: JSON.stringify(body) }),
  deleteZone: (id)       => apiFetch(`/shipping-zones/${id}`, { method: 'DELETE' }),
};
