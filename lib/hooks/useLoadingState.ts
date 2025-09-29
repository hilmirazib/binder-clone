import { useState, useCallback } from "react";
import { toast } from "sonner";

interface UseLoadingStateOptions {
  onSuccess?: (result: any) => void;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export function useLoadingState(options: UseLoadingStateOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const execute = useCallback(
    async <T>(asyncFunction: () => Promise<T>): Promise<T | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await asyncFunction();

        if (options.successMessage) {
          toast.success(options.successMessage);
        }

        options.onSuccess?.(result);
        return result;
      } catch (err) {
        const error = err as Error;
        setError(error);

        const errorMessage = options.errorMessage || error.message;
        toast.error(errorMessage);

        options.onError?.(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [options],
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    execute,
    reset,
  };
}
