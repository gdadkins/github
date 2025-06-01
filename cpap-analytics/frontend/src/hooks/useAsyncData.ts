import { useState, useCallback } from 'react';

interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseAsyncDataOptions {
  initialData?: any;
  onSuccess?: (data: any) => void;
  onError?: (error: string) => void;
}

export const useAsyncData = <T>(
  asyncFunction: () => Promise<T>,
  options: UseAsyncDataOptions = {}
) => {
  const [state, setState] = useState<AsyncState<T>>({
    data: options.initialData || null,
    loading: false,
    error: null
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      const result = await asyncFunction();
      setState({ data: result, loading: false, error: null });
      options.onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setState(prev => ({ ...prev, loading: false, error: errorMessage }));
      options.onError?.(errorMessage);
      throw err;
    }
  }, [asyncFunction, options]);

  const reset = useCallback(() => {
    setState({ data: options.initialData || null, loading: false, error: null });
  }, [options.initialData]);

  return {
    ...state,
    execute,
    reset,
    isIdle: !state.loading && !state.error && !state.data
  };
};