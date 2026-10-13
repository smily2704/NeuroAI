/**
 * useAsync — tiny data-loading hook giving every screen the same
 * loading / error / data lifecycle.
 *
 * State is only updated inside async callbacks (never synchronously in the
 * effect body) to satisfy the react-hooks/set-state-in-effect rule.
 */

import * as React from 'react';

interface UseAsyncResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useAsync<T>(task: () => Promise<T>, deps: React.DependencyList = []): UseAsyncResult<T> {
  const [state, setState] = React.useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });
  const [attempt, setAttempt] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    task()
      .then((result) => {
        if (!cancelled) setState({ data: result, loading: false, error: null });
      })
      .catch((cause: unknown) => {
        if (!cancelled) {
          setState({
            data: null,
            loading: false,
            error: cause instanceof Error ? cause.message : 'Something went wrong.',
          });
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt, ...deps]);

  const reload = React.useCallback(() => {
    setState({ data: null, loading: true, error: null });
    setAttempt((value) => value + 1);
  }, []);

  return { ...state, reload };
}
