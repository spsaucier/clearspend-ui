import type { FetchMethod, FetchOptions, FetchResponse } from './types';

export function fetch<T = unknown>(
  method: FetchMethod,
  url: string,
  params?: object,
  options: Readonly<Partial<FetchOptions>> = {},
): Promise<FetchResponse<T>> {
  return new Promise((resolve, reject) => {
    window
      .fetch(url, {
        method,
        cache: 'no-cache',
        body: params ? JSON.stringify(params) : null,
        headers: { 'Content-Type': 'application/json', ...options.headers },
      })
      .then((resp) => {
        const response: FetchResponse = { url, status: resp.status, data: null };

        return resp
          .text()
          .then((body: string) => {
            const result: FetchResponse<T> = { ...response, data: (body ? JSON.parse(body) : null) as T };
            resp.ok ? resolve(result) : reject(result);
          })
          .catch((error: unknown) => {
            // eslint-disable-next-line prefer-promise-reject-errors
            reject({ ...response, data: error });
          });
      })
      .catch(reject);
  });
}
