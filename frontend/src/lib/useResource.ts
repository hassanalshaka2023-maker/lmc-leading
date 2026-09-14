import { useEffect, useRef, useState } from 'react';
import i18n from '../i18n';
import { api } from './api';

interface State<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

/** How long a successful response is reused before refetching. Short enough
 * that dashboard edits show up within a minute. */
const CACHE_TTL_MS = 60_000;

interface Entry {
  at: number;
  promise: Promise<unknown>;
  data?: unknown;
}

const cache = new Map<string, Entry>();

/** One shared request per path. */
function load<T>(path: string): Promise<T> {
  const hit = cache.get(path);
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.promise as Promise<T>;

  const entry: Entry = { at: Date.now(), promise: Promise.resolve() };
  entry.promise = api.get<T>(path).then(
    (res) => {
      entry.data = res.data;
      return res.data;
    },
    (err) => {
      // Never cache failures — the next mount retries.
      if (cache.get(path) === entry) cache.delete(path);
      throw err;
    },
  );
  cache.set(path, entry);
  return entry.promise as Promise<T>;
}

function freshData<T>(path: string): T | null {
  const hit = cache.get(path);
  return hit && hit.data !== undefined && Date.now() - hit.at < CACHE_TTL_MS
    ? (hit.data as T)
    : null;
}

/**
 * GET hook: fetches `path` on mount (and when `path` changes), ignoring stale
 * responses. Requests for the same path are de-duplicated and reused for
 * `CACHE_TTL_MS`.
 */
export function useResource<T>(path: string) {
  const [state, setState] = useState<State<T>>(() => {
    const data = freshData<T>(path);
    return { data, loading: data === null, error: null };
  });
  const reqId = useRef(0);

  useEffect(() => {
    const id = ++reqId.current;
    const cached = freshData<T>(path);
    if (cached !== null) {
      setState({ data: cached, loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));

    load<T>(path)
      .then((data) => {
        if (id === reqId.current) {
          setState({ data, loading: false, error: null });
        }
      })
      .catch(() => {
        // Generic translated message instead of the backend error.
        if (id === reqId.current) {
          setState({
            data: null,
            loading: false,
            error: i18n.t('common.errorBody'),
          });
        }
      });
  }, [path]);

  return state;
}
