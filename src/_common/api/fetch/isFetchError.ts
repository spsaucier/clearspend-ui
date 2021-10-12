import type { FetchResponse } from './types';

export function isFetchError<T = null>(error: unknown): error is FetchResponse<T> {
  return typeof error === 'object' && error !== null && 'status' in error;
}
