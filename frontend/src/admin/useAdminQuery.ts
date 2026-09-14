import { useCallback, useEffect, useRef, useState } from 'react';
import { adminApi, apiErrorMessage } from './adminApi';

interface Result<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useAdminQuery<T>(path: string | null): Result<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(!!path);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const reqId = useRef(0);

  useEffect(() => {
    if (!path) return;
    const id = ++reqId.current;
    setLoading(true);
    setError(null);
    adminApi
      .get<T>(path)
      .then((res) => {
        if (id === reqId.current) setData(res.data);
      })
      .catch((err) => {
        if (id === reqId.current) setError(apiErrorMessage(err));
      })
      .finally(() => {
        if (id === reqId.current) setLoading(false);
      });
  }, [path, tick]);

  const reload = useCallback(() => setTick((t) => t + 1), []);
  return { data, loading, error, reload };
}
