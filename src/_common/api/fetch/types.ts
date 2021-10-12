export type FetchMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export enum HttpStatus {
  OK = 200,
  Accepted = 202,
  AccessDenied = 401,
  NotFound = 404,
  Forbidden = 403,
  ServerError = 500,
}

export interface FetchHeaders {
  [key: string]: string;
}

export interface FetchOptions {
  headers: FetchHeaders;
}

export interface FetchResponse<T = unknown> {
  url: string;
  status: HttpStatus;
  data: T;
}
