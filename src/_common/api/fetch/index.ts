import type { FetchMethod, FetchOptions, FetchResponse } from './types';

function parse<T = unknown>(body: string, type: string | null): T {
  if (type?.includes('application/json')) return JSON.parse(body) as T;
  if (type?.includes('text/plain')) return body as unknown as T;
  return null as unknown as T;
}

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
            const result: FetchResponse<T> = {
              ...response,
              data: parse(body, resp.headers.get('content-type')),
            };
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
