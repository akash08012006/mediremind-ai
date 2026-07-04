const API_BASE = '/api';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  return response.json();
}

export const api = {
  async healthCheck() {
    const res = await fetch(`${API_BASE}/health`);
    return handleResponse<{ status: string }>(res);
  },

  async register(data: { name: string; email: string; password: string; role: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ id: string; name: string; email: string; role: string; message: string }>(res);
  },

  async login(data: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ id: string; name: string; email: string; role: string }>(res);
  },

  async googleAuth(data: { email: string; name?: string }) {
    const res = await fetch(`${API_BASE}/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse<{ id: string; name: string; email: string; role: string }>(res);
  },

  async getProfile(userId: string) {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: { 'X-User-Id': userId }
    });
    return handleResponse<{ id: string; name: string; email: string; role: string }>(res);
  }
};
