// Central API layer. Leave VITE_API_BASE_URL empty to use the demo data provider.
// When a Flask backend is connected, service functions call apiRequest() instead.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const USE_BACKEND = Boolean(API_BASE_URL);

export async function apiRequest(path, { method = 'GET', body } = {}) {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status}).`);
  return data;
}

// Fails loudly instead of silently pretending a backend call succeeded.
export function assertDemoMode(action) {
  if (USE_BACKEND) {
    throw new Error(`${action} needs the Flask API, which is not connected yet. Clear VITE_API_BASE_URL to use demo mode.`);
  }
}
