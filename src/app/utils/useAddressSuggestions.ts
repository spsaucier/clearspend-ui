import { createSignal, createEffect, Accessor } from 'solid-js';
import createDebounce from '@solid-primitives/debounce';

import { getAddressesSuggestions, Suggestion, SuggestionsRequest } from '_common/api/suggestions/address';
import { wrapAction } from '_common/utils/wrapAction';
import { validStreetLine1 } from '_common/components/Form/rules/patterns';

const DEBOUNCE_MS = 300;
const MIN_CHARS = 4;

export function formatSuggestion(value: Readonly<Suggestion>): string {
  return `${value.primary_line} ${value.city}, ${value.state} ${value.zip_code}`;
}

export function useAddressSuggestions(values: Accessor<SuggestionsRequest>) {
  const [prevStreetValue, setPrevStreetValue] = createSignal('');
  const [suggestions, setSuggestions] = createSignal<readonly Suggestion[]>([]);

  const [loading, getAddressData] = wrapAction(async () => {
    const params = values();
    if (prevStreetValue() !== params.address_prefix) {
      setSuggestions(await getAddressesSuggestions(params));
      setPrevStreetValue(params.address_prefix);
    }
  });

  const [trigger, clear] = createDebounce(getAddressData, DEBOUNCE_MS);

  createEffect(() => {
    const prefix = values().address_prefix;
    if (prefix.length >= MIN_CHARS && validStreetLine1(prefix) === true) {
      trigger();
    } else {
      setSuggestions([]);
      clear();
    }
  });

  return { suggestions, loading };
}
