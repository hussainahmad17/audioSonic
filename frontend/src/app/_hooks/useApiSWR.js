import useSWR from 'swr';
import { apiClient } from '@app/backendServices/ApiCalls';

const normalizePayload = (payload) => {
  if (Array.isArray(payload)) {
    return { data: payload };
  }

  if (payload && typeof payload === 'object') {
    return payload;
  }

  return { data: payload };
};

const defaultFetcher = async (url) => {
  const res = await apiClient.get(url);
  return normalizePayload(res.data);
};

export function useApiSWR(key, fetcher = defaultFetcher, options = {}) {
  const swr = useSWR(key, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    revalidateIfStale: false,
    dedupingInterval: 30000,
    ...options,
  });
  return swr;
}
