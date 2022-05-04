export type FetchMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';

export enum HttpStatus {
  OK = 200,
  Accepted = 202,
  StepUpRequired = 242,
  AccessDenied = 401,
  NotFound = 404,
  Forbidden = 403,
  ServerError = 500,
}

export enum RespType {
  default,
  blob,
}

export interface FetchHeaders {
  [key: string]: string;
}

export interface FetchOptions {
  headers: FetchHeaders;
  respType: RespType;
}

export interface FetchResponse<T = unknown> {
  url: string;
  method: FetchMethod;
  status: HttpStatus;
  data: T;
}
