import { useCallback, useState } from "react";

type ApiFunction<T> = (...args: any[]) => Promise<T>;

const useApi = <T,>(apiFunction: ApiFunction<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const execute = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      try {
        const result = await apiFunction(...args);
        setData(result);
        setError(null);
        return result;
      } catch (error: any) {
        console.log({ error });
        const errors = error.response?.data.errors;
        setError(errors ? errors[0].message : error.message);
      } finally {
        setLoading(false);
      }
    },
    [apiFunction]
  );

  const resetLoading = () => {
    setData(null);
    setError(null);
    setLoading(true);
  };

  return {
    data,
    error,
    loading,
    execute,
    resetLoading,
  };
};

export default useApi;
