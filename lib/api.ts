/* Shared API helpers used by the frontend. Small, typed wrappers around fetch.
   Uses NEXT_PUBLIC_API_URL if provided, otherwise calls relative paths. */

const BASE = process.env.NEXT_PUBLIC_API_URL || '';

type FetchOpts = { token?: string };

async function request<T>(path: string, opts: RequestInit = {}, { token }: FetchOpts = {}) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(opts.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...opts, headers });
  const text = await res.text();
  let data: any = undefined;
  try { data = text ? JSON.parse(text) : undefined; } catch(e) { data = text; }
  if (!res.ok) throw new Error(data?.message || res.statusText || 'API error');
  return data as T;
}

export async function signup(email: string, password: string) {
  return request<{ token: string; user: { id: string; email: string } }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function login(email: string, password: string) {
  return request<{ token: string; user: { id: string; email: string } }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function fetchItems(filters?: Record<string, any>) {
  const qs = filters ? '?' + new URLSearchParams(filters).toString() : '';
  return request<any[]>('/api/items' + qs, { method: 'GET' });
}

export async function fetchItem(id: string) {
  return request<any>(`/api/items/${encodeURIComponent(id)}`);
}

export async function getCart(token?: string) {
  return request<any>('/api/cart', { method: 'GET' }, { token });
}

export async function addToCart(itemId: string, quantity = 1, token?: string) {
  return request<any>('/api/cart/add', {
    method: 'POST',
    body: JSON.stringify({ itemId, quantity }),
  }, { token });
}

export async function removeFromCart(itemId: string, token?: string) {
  return request<any>('/api/cart/remove', {
    method: 'POST',
    body: JSON.stringify({ itemId }),
  }, { token });
}

export default { signup, login, fetchItems, fetchItem, getCart, addToCart, removeFromCart };
