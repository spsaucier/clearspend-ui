import { fetch } from '_common/api/fetch';
import { isFetchError } from '_common/api/fetch/isFetchError';
import { HttpStatus } from '_common/api/fetch/types';
import { events } from '_common/api/events';
import type { FormValues } from 'employees/components/EditEmployeeForm/types';

import { AppEvent } from '../types/common';

export type Suggestion = {
  primary_line: string;
  city: string;
  state: string;
  zip_code: string;
};

export interface SuggestionsResponse {
  id?: string;
  suggestions: Suggestion[];
  object?: string;
}

function errorHandler(error: unknown) {
  if (isFetchError(error) && error.status === HttpStatus.AccessDenied) {
    events.emit(AppEvent.Logout);
    // eslint-disable-next-line prefer-promise-reject-errors
    return Promise.reject(null);
  }
  return Promise.reject(error);
}

async function getAddresses<T = unknown>(values: FormValues) {
  const headers = {
    Authorization: 'Basic bGl2ZV9lMGY2MDlkM2MwZTk3NzYxYTQ0OTE2MGQ5NGE4NWRmNWU0NTo=',
  };

  const params = {
    address_prefix: values.streetLine1,
    city: values.locality,
    state: values.region,
    zip_code: values.postalCode,
  };

  const requestOptions = {
    method: 'POST',
    headers,
  };
  return fetch<T>('POST', 'https://api.lob.com/v1/us_autocompletions', params, requestOptions).catch(errorHandler);
}

export { getAddresses };
