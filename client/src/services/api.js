const API_BASE = import.meta.env.VITE_API_URL || '/api';

export async function checkHealth() {
  const response = await fetch(`${API_BASE}/health`);

  if (!response.ok) {
    throw new Error(`Health check failed: ${response.status}`);
  }

  return response.json();
}

async function handleResponse(response) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'حصل خطأ، حاولي تاني');
  }

  return data;
}

export async function getProducts(params = {}) {
  const query = new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== '' && value !== null)
    )
  ).toString();

  const response = await fetch(`${API_BASE}/products${query ? `?${query}` : ''}`);

  return handleResponse(response);
}

function authHeaders() {
  const token = localStorage.getItem('authToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function uploadImageRequest(file) {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: formData,
  });

  return handleResponse(response);
}

export async function createProductRequest(product) {
  const response = await fetch(`${API_BASE}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(product),
  });

  return handleResponse(response);
}

export async function updateProductRequest(id, product) {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(product),
  });

  return handleResponse(response);
}

export async function deleteProductRequest(id) {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  });

  return handleResponse(response);
}

export async function signupRequest({ name, email, password, phone }) {
  const response = await fetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, phone }),
  });

  return handleResponse(response);
}

export async function loginRequest({ email, password }) {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
}
