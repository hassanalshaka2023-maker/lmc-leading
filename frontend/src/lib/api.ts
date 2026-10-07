import axios from 'axios';

/**
 * Public API client. In dev, Vite proxies /api → http://localhost:3000.
 * Override with VITE_API_BASE_URL for other setups.
 */
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 15000,
});

// A missing/wrong API URL on a static host returns index.html with 200 —
// treat any non-JSON body as a failed request instead of crashing the page.
api.interceptors.response.use((res) => {
  if (typeof res.data === 'string') {
    return Promise.reject(new Error(`Non-JSON response from ${res.config.url}`));
  }
  return res;
});
