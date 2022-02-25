import { fetch } from '_common/api/fetch';

export interface SuggestionsRequest {
  address_prefix: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface Suggestion {
  primary_line: string;
  city: string;
  state: string;
  zip_code: string;
}

export interface SuggestionsResponse {
  suggestions: readonly Readonly<Suggestion>[];
}

const US_URL = 'https://api.lob.com/v1/us_autocompletions';
const AUTH_HEADER = 'Basic bGl2ZV9lMGY2MDlkM2MwZTk3NzYxYTQ0OTE2MGQ5NGE4NWRmNWU0NTo=';

export async function getAddressesSuggestions(params: Readonly<SuggestionsRequest>) {
  return (
    await fetch<Readonly<SuggestionsResponse>>(
      'POST',
      US_URL,
      { address_prefix: params.address_prefix, state: params.state, geo_ip_sort: 'true' },
      { headers: { Authorization: AUTH_HEADER } },
    )
  ).data.suggestions;
}
