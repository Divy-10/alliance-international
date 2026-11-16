import { useCallback, useEffect, useState } from 'react';

/**
 * Runs an async loader and exposes { data, loading, error, reload }.
 * Re-runs whenever `deps` change; ignores results from stale runs.
 */
export function useAsync(loader, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));
    loader()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (!alive) return;
        // Suppress noisy logs in production; always log in development.
        if (import.meta.env.DEV) {
          console.error('[catalogue]', error);
        }
        setState({ data: null, loading: false, error });
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { ...state, reload };
}
