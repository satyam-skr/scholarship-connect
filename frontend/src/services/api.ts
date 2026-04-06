/**
 * ============================================================
 * SmartScholar — API Service Layer Template
 * ============================================================
 *
 * This file is the SINGLE entry point for all backend communication.
 * Currently it uses mock data with simulated delays.
 *
 * TO CONNECT A REAL BACKEND:
 * 1. Set your API base URL below (or use env vars)
 * 2. Replace the mock implementations in each service file
 *    (donorService.ts, studentService.ts, etc.) with calls to `api.get()`, `api.post()`, etc.
 * 3. Add your auth token logic in the `getHeaders()` function
 *
 * Each service file (e.g., donorService.ts) should import from here:
 *   import { api } from '@/services/api';
 *   const donations = await api.get<Donation[]>('/donors/d1/donations');
 */

// ─── Configuration ──────────────────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// ─── Auth Token Management ──────────────────────────────────
let authToken: string | null = localStorage.getItem('authToken');

export const setAuthToken = (token: string | null) => {
  authToken = token;
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  return headers;
};

// ─── Response Type ──────────────────────────────────────────
// ─── Error Handling ─────────────────────────────────────────
class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new ApiError(
      errorData?.message || `HTTP ${response.status}: ${response.statusText}`,
      response.status,
      errorData
    );
  }
  return response.json();
}

// ─── Core API Methods ───────────────────────────────────────
export const api = {
  get: async <T>(endpoint: string, params?: Record<string, string>): Promise<T> => {
    const url = new URL(`${API_BASE_URL}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
    }
    const res = await fetch(url.toString(), { method: 'GET', headers: getHeaders() });
    return handleResponse<T>(res);
  },

  post: async <T>(endpoint: string, body?: unknown): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  put: async <T>(endpoint: string, body?: unknown): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  patch: async <T>(endpoint: string, body?: unknown): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: body ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<T>(res);
  },

  upload: async <T>(endpoint: string, formData: FormData): Promise<T> => {
    const headers: HeadersInit = {};
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse<T>(res);
  },
};

// ─── Example: How to migrate a service ──────────────────────
//
// BEFORE (mock):
//   export const donorService = {
//     getDonations: (donorId: string) =>
//       delay(donations.filter(d => d.donorId === donorId)),
//   };
//
// AFTER (real API):
//   import { api } from '@/services/api';
//   export const donorService = {
//     getDonations: (donorId: string) =>
//       api.get<Donation[]>(`/donors/${donorId}/donations`),
//   };
//
// That's it. The component code stays the same.
// ─────────────────────────────────────────────────────────────
