import { useState, useCallback, useRef } from 'react';
import type { ApiError } from '../utils/error-handler';
import { handleApiError } from '../utils/error-handler';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiOptions {
  onSuccess?: (data: unknown) => void;
  onError?: (error: ApiError) => void;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (fn: () => Promise<T>, options?: UseApiOptions) => {
      abortControllerRef.current = new AbortController();
      setState({ data: null, loading: true, error: null });

      try {
        const result = await fn();
        setState({ data: result, loading: false, error: null });
        options?.onSuccess?.(result);
        return result;
      } catch (error) {
        const apiError = handleApiError(error);
        setState((prev) => ({ ...prev, loading: false, error: apiError }));
        options?.onError?.(apiError);
        throw apiError;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
    abortControllerRef.current?.abort();
  }, []);

  return { ...state, execute, reset };
}
