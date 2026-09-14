import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { adminApi, tokenStore } from './adminApi';

interface AdminUser {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  user: AdminUser | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [ready, setReady] = useState(false);

  const loadMe = useCallback(async () => {
    try {
      const { data } = await adminApi.get<AdminUser>('/auth/me');
      setUser(data);
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (tokenStore.refresh) await loadMe();
      setReady(true);
    })();
  }, [loadMe]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await adminApi.post('/auth/login', { email, password });
      tokenStore.access = data.accessToken;
      tokenStore.refresh = data.refreshToken;
      await loadMe();
    },
    [loadMe],
  );

  const logout = useCallback(async () => {
    try {
      await adminApi.post('/auth/logout');
    } catch {
      /* ignore */
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, login, logout }),
    [user, ready, login, logout],
  );
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error('useAuth must be used within AuthProvider');
  return v;
}
