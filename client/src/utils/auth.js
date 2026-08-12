const AUTH_USER_KEY = 'elD7e7User';
const AUTH_TOKEN_KEY = 'authToken';

export function getStoredUser() {
  try {
    const storedUser = localStorage.getItem(AUTH_USER_KEY);

    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getStoredUser() && getAuthToken());
}

export function saveAuthSession({ user, token }) {
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  localStorage.setItem(AUTH_TOKEN_KEY, token);

  window.dispatchEvent(new Event('auth-change'));
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(AUTH_TOKEN_KEY);

  window.dispatchEvent(new Event('auth-change'));
}