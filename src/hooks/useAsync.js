import { useCallback, useEffect, useState } from 'react';

/**
 * Runs an async loader and exposes { data, loading, error, reload }.
 * Supports `initialData` (or factory function) so pages render immediately
 * on mount (Frame 1) without waiting or flashing empty skeletons.
 * Listens for background 'catalog-refreshed' events to keep data live.
 */
export function useAsync(loader, deps = [], initialData = null) {
  const [state, setState] = useState(() => {
    let initial = null;
    try {
      initial = typeof initialData === 'function' ? initialData() : initialData;
    } catch {
      initial = null;
    }
    const hasInitial = initial !== null && initial !== undefined;
    return {
      data: hasInitial ? initial : null,
      loading: !hasInitial,
      error: null,
    };
  });

  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;

    // Only show loading spinner/skeleton if we don't already have data
    setState((s) => ({ ...s, loading: s.data ? false : true, error: null }));

    loader()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => {
        if (!alive) return;
        if (import.meta.env.DEV) {
          console.error('[useAsync]', error);
        }
        setState((s) => ({ ...s, loading: false, error }));
      });

    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  // Listen to background revalidations from Google Sheets SWR
  useEffect(() => {
    let alive = true;
    const handleRefreshed = () => {
      if (!alive) return;
      loader()
        .then((data) => alive && setState((s) => ({ ...s, data, loading: false })))
        .catch(() => {});
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('catalog-refreshed', handleRefreshed);
      return () => {
        alive = false;
        window.removeEventListener('catalog-refreshed', handleRefreshed);
      };
    }
  }, [loader]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);
  return { ...state, reload };
}
