import { fetch } from '_common/api/fetch';
import { isFetchError } from '_common/api/fetch/isFetchError';
import { FetchOptions, HttpStatus } from '_common/api/fetch/types';

function prefixUrl(url: string): string {
  return `/api${url}`;
}

function errorHandler(error: unknown) {
  if (isFetchError(error) && error.status === HttpStatus.AccessDenied) {
    // TODO: Emit logout event
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(null);
  }
  return Promise.reject(error);
}

async function get<T = unknown>(url: string) {
  return fetch<T>('GET', prefixUrl(url)).catch(errorHandler);
}

async function post<T = unknown>(url: string, params?: object, options?: FetchOptions) {
  return fetch<T>('POST', prefixUrl(url), params, options).catch(errorHandler);
}

async function patch<T = unknown>(url: string, params?: object, options?: FetchOptions) {
  return fetch<T>('PATCH', prefixUrl(url), params, options).catch(errorHandler);
}

async function remove(url: string, params?: object, options?: FetchOptions) {
  return fetch('DELETE', prefixUrl(url), params, options).catch(errorHandler);
}

export const service = { get, post, patch, remove };
