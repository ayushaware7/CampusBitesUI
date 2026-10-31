import { API_BASE } from '../config';
import { getCanteenSlug } from './canteen';

// Throws Error(message) using the backend's {"error": "..."} body, so screens can show it directly.
async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth) headers.Authorization = `Bearer ${localStorage.getItem('adminToken')}`;

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error('Cannot reach the server. Is the backend running?');
  }

  if (res.status === 401 && auth) {
    // expired or invalid admin session
    localStorage.removeItem('adminToken');
    window.location.assign('/admin/login');
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error((data && data.error) || `Request failed (${res.status})`);
  return data;
}

const save = (base, id, body) =>
  request(id ? `${base}/${id}` : base, { method: id ? 'PUT' : 'POST', body, auth: true });

const canteenPath = () => `/api/v1/canteens/${encodeURIComponent(getCanteenSlug())}`;

export const publicApi = {
  canteen: () => request(canteenPath()),
  menu: () => request(`${canteenPath()}/menu`),
  // The server prices the cart itself: send ids and quantities only.
  placeOrder: (body) => request(`${canteenPath()}/orders`, { method: 'POST', body }),
  verifyPayment: (body) => request('/api/v1/payments/verify', { method: 'POST', body }),
  trackOrder: (code, phone) =>
    request(`${canteenPath()}/orders/track?code=${encodeURIComponent(code)}&phone=${encodeURIComponent(phone)}`),
};

export const adminApi = {
  login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password } }),
  canteen: () => request('/api/v1/admin/canteen', { auth: true }),
  saveCanteen: (body) => request('/api/v1/admin/canteen', { method: 'PUT', body, auth: true }),
  menu: () => request('/api/v1/admin/menu', { auth: true }),

  saveCategory: (id, body) => save('/api/v1/admin/categories', id, body),
  deleteCategory: (id) => request(`/api/v1/admin/categories/${id}`, { method: 'DELETE', auth: true }),

  saveItem: (id, body) => save('/api/v1/admin/items', id, body),
  setAvailability: (id, isAvailable) =>
    request(`/api/v1/admin/items/${id}/availability`, { method: 'PATCH', body: { isAvailable }, auth: true }),
  deleteItem: (id) => request(`/api/v1/admin/items/${id}`, { method: 'DELETE', auth: true }),

  orders: (view) => request(`/api/v1/admin/orders?view=${view}`, { auth: true }), // 'live' | 'past'
  setOrderStatus: (id, status) =>
    request(`/api/v1/admin/orders/${id}/status`, { method: 'PATCH', body: { status }, auth: true }),

  addonGroups: () => request('/api/v1/admin/addon-groups', { auth: true }),
  saveAddonGroup: (id, body) => save('/api/v1/admin/addon-groups', id, body),
  deleteAddonGroup: (id) => request(`/api/v1/admin/addon-groups/${id}`, { method: 'DELETE', auth: true }),
};
