import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import i18n from '../i18n';

const REFRESH_KEY = 'lmc.admin.refresh';

let accessToken: string | null = null;
export const tokenStore = {
  get access() {
    return accessToken;
  },
  set access(v: string | null) {
    accessToken = v;
  },
  get refresh() {
    try {
      return localStorage.getItem(REFRESH_KEY);
    } catch {
      return null;
    }
  },
  set refresh(v: string | null) {
    try {
      if (v) localStorage.setItem(REFRESH_KEY, v);
      else localStorage.removeItem(REFRESH_KEY);
    } catch {
      /* private mode / disabled storage */
    }
  },
  clear() {
    accessToken = null;
    this.refresh = null;
  },
};

export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 20000,
});

adminApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

let refreshing: Promise<string | null> | null = null;

async function runRefresh(): Promise<string | null> {
  const rt = tokenStore.refresh;
  if (!rt) return null;
  try {
    const { data } = await axios.post(
      `${adminApi.defaults.baseURL}/auth/refresh`,
      { refreshToken: rt },
    );
    tokenStore.access = data.accessToken;
    tokenStore.refresh = data.refreshToken;
    return data.accessToken as string;
  } catch {
    tokenStore.clear();
    return null;
  }
}

adminApi.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retried?: boolean })
      | undefined;
    if (
      error.response?.status === 401 &&
      original &&
      !original._retried &&
      !original.url?.includes('/auth/')
    ) {
      original._retried = true;
      refreshing = refreshing ?? runRefresh();
      const newToken = await refreshing;
      refreshing = null;
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return adminApi(original);
      }
    }
    return Promise.reject(error);
  },
);

/** Backend error messages that need translating in the dashboard. */
const KNOWN_ERROR_KEYS: Record<string, string> = {
  'Invalid credentials': 'admin.login.errorInvalidCredentials',
  'Invalid refresh token': 'admin.common.sessionExpired',
  'Invalid or expired code': 'admin.login.errorInvalidCode',
};

export function apiErrorMessage(err: unknown): string {
  const m = (err as AxiosError<{ message?: string | string[] }>)?.response?.data
    ?.message;
  if (Array.isArray(m)) return m.join(i18n.language === 'ar' ? '، ' : ', ');

  if (typeof m === 'string') {
    if (KNOWN_ERROR_KEYS[m]) return i18n.t(KNOWN_ERROR_KEYS[m]);

    const locked = m.match(/^Account locked\. Try again after (.+)$/);
    if (locked) {
      const time = new Date(locked[1]).toLocaleTimeString(
        i18n.language === 'ar' ? 'ar' : 'en-US',
        { hour: '2-digit', minute: '2-digit' },
      );
      return i18n.t('admin.login.errorAccountLocked', { time });
    }

    if (/ThrottlerException|too many requests/i.test(m)) {
      return i18n.t('admin.common.tooManyRequests');
    }

    // e.g. `Trainer not found`, `Page "about" not found`
    if (/not found$/i.test(m)) return i18n.t('admin.common.errorNotFound');
    if (/^A record with these unique values already exists$/.test(m)) {
      return i18n.t('admin.common.errorDuplicate');
    }
    if (/^Malformed identifier$/.test(m)) {
      return i18n.t('admin.common.errorMalformed');
    }
    if (/^Insufficient role$/.test(m)) {
      return i18n.t('admin.common.errorForbidden');
    }
  }

  return m ?? i18n.t('admin.common.genericError');
}
