import { auth } from '../firebase/firebaseConfig';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Get active Firebase ID token for Authorization header
 */
export async function getAuthToken() {
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      if (token) return token;
    } catch (e) {
      console.warn('Could not retrieve Firebase token:', e);
    }
  }

  const storedToken = localStorage.getItem('carekey_token');
  if (storedToken) return storedToken;

  const currentRole = (localStorage.getItem('carekey_current_role') || 'PATIENT').toLowerCase();
  return `token-demo-${currentRole}`;
}

/**
 * Real API Request Dispatcher
 * Sends requests to Spring Boot backend with Firebase Bearer token.
 * If backend fails, throws real error (NO mock fallbacks per Part 25).
 */
export async function apiRequest(endpoint, options = {}) {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (response.ok) {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    return await response.text();
  }

  const errData = await response.json().catch(() => ({}));
  const error = new Error(errData.message || `Server request failed with status ${response.status}`);
  error.status = response.status;
  error.data = errData;
  throw error;
}
