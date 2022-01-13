import { createSignal, createEffect, Accessor } from 'solid-js';
import createDebounce from '@solid-primitives/debounce';

import { type Suggestion, getAddresses, type SuggestionsResponse } from 'app/services/address';
import { validStreetLine1 } from '_common/components/Form/rules/patterns';
import type { AddressValues } from '_common/components/AddressFormItems/types';

const DEBOUNCE_MS = 300;
const MIN_CHARS = 4;

export const useAddressSuggestions = (values: Accessor<AddressValues>) => {
  const [prevStreetValue, setPrevStreetValue] = createSignal('');
  const [suggestions, setSuggestions] = createSignal<Suggestion[]>([]);
  const [loading, setLoading] = createSignal(false);

  const getAddressData = async () => {
    if (prevStreetValue() !== values().streetLine1) {
      setLoading(true);
      // TODO: Switch this to normal `fetch` to capital-core when available
      const data = (await getAddresses(values())).data as SuggestionsResponse;
      setSuggestions(data.suggestions);
      setPrevStreetValue(values().streetLine1);
      setLoading(false);
    }
  };

  const [trigger, clear] = createDebounce(getAddressData, DEBOUNCE_MS);

  createEffect(() => {
    if (validStreetLine1(values().streetLine1) === true && values().streetLine1.length >= MIN_CHARS) {
      trigger();
    } else {
      setSuggestions([]);
      clear();
    }
  });

  return { suggestions, loading };
};
