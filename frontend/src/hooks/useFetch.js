import { useState, useEffect, useCallback } from 'react';

/**
 * useFetch — generic hook for async data fetching.
 * @param {Function} fetchFn - The async API function to call
 * @param {boolean} immediate - Whether to call on mount (default: true)
 * @returns {{ data, loading, error, refetch }}
 */
const useFetch = (fetchFn, immediate = true) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);

  const execute = useCallback(async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn(...args);
      setData(result);
      return result;
    } catch (err) {
      const message = err.response?.data?.message || err.message || 'Something went wrong';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchFn]);

  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []);  // eslint-disable-line react-hooks/exhaustive-deps

  return { data, loading, error, refetch: execute };
};

export default useFetch;
