import { fetch } from '_common/api/fetch';
import { FetchOptions, HttpStatus, FetchResponse } from '_common/api/fetch/types';
import { events } from '_common/api/events';
import type { ControllerError } from 'generated/capital';
import { getCurrentBusinessId } from '_common/api/businessId';

import { AppEvent } from '../types/common';

import { Events, sendAnalyticsEvent } from './analytics';

export { RespType } from '_common/api/fetch/types';

function prefixUrl(url: string): string {
  return `/api${url}`;
}

function logFetch<T = unknown>(resp: FetchResponse<T>, isError?: boolean) {
  sendAnalyticsEvent({
    name: Events[`${resp.method}_${isError ? 'ERROR' : 'SUCCESS'}`],
    data: {
      url: resp.url,
      ...(isError ? { error: resp.data } : { result: resp.data }),
    },
  });
}

function parseError(message: string): unknown {
  try {
    return JSON.parse(message);
  } catch (error: unknown) {
    return message;
  }
}

function errorHandler<T = unknown>(error: FetchResponse): Promise<FetchResponse<T>> {
  if (error.status === HttpStatus.AccessDenied) {
    if (window.location.toString().split(window.location.host)[1] !== '/login') {
      events.emit(AppEvent.Logout, window.location.toString().split(window.location.host)[1]);
    }
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(null);
  }

  const data = error.data as ControllerError | null;
  const message = data?.message;
  return Promise.reject(
    typeof message === 'string' ? { ...error, data: { message: parseError(message), ...data } } : error,
  );
}

function wrapFetch<T = unknown>(fetcher: Promise<FetchResponse<T>>): Promise<FetchResponse<T>> {
  return fetcher
    .then((resp) => {
      logFetch(resp);
      return resp;
    })
    .catch((error: FetchResponse<T>) => {
      logFetch(error, true);
      return errorHandler(error);
    });
}

function mergeHeadersIntoOptions(options: Partial<FetchOptions> = {}): Partial<FetchOptions> {
  const businessId = getCurrentBusinessId();
  return {
    ...options,
    headers: {
      ...options.headers,
      ...(businessId && { 'X-Company-ID': businessId }),
    },
  };
}

async function get<T = unknown>(url: string, options?: Partial<FetchOptions>) {
  return wrapFetch(fetch<T>('GET', prefixUrl(url), undefined, mergeHeadersIntoOptions(options)));
}

async function post<T = unknown>(url: string, params?: object | string, options?: Partial<FetchOptions>) {
  return wrapFetch(fetch<T>('POST', prefixUrl(url), params, mergeHeadersIntoOptions(options)));
}

async function patch<T = unknown>(url: string, params?: object | string, options?: Partial<FetchOptions>) {
  return wrapFetch(fetch<T>('PATCH', prefixUrl(url), params, mergeHeadersIntoOptions(options)));
}

async function put<T = unknown>(url: string, params?: object | string, options?: Partial<FetchOptions>) {
  return wrapFetch(fetch<T>('PUT', prefixUrl(url), params, mergeHeadersIntoOptions(options)));
}

async function remove<T = unknown>(url: string, params?: object, options?: Partial<FetchOptions>) {
  return wrapFetch(fetch<T>('DELETE', prefixUrl(url), params, mergeHeadersIntoOptions(options)));
}

export const service = { get, post, patch, put, remove };
