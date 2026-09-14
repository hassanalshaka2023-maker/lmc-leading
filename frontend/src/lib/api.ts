import axios from 'axios';

/**
 * Public API client. In dev, Vite proxies /api → http://localhost:3000.
 * Override with VITE_API_BASE_URL for other setups.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
});
