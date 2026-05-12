import { SWRConfiguration, SWRResponse } from 'swr';
import useSWR, { mutate } from 'swr';

export interface QueryProviderOptions {
  fallbackData?: Record<string, unknown>;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function useQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
  options?: SWRConfiguration<T>
): SWRResponse<T, Error> {
  return useSWR<T, Error>(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: true,
    ...options,
  });
}

export function useMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: Error, variables: TVariables) => void;
    onSettled?: (data: TData | undefined, error: Error | null, variables: TVariables) => void;
  }
) {
  const { onSuccess, onError, onSettled } = options || {};

  return async (variables: TVariables): Promise<TData> => {
    try {
      const data = await mutationFn(variables);
      onSuccess?.(data, variables);
      onSettled?.(data, null, variables);
      return data;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      onError?.(err, variables);
      onSettled?.(undefined, err, variables);
      throw err;
    }
  };
}

export function invalidateQuery(key: string): void {
  mutate(key);
}

export function invalidateQueries(keys: string[]): void {
  keys.forEach((key) => mutate(key));
}