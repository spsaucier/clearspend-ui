import { Text } from 'solid-i18n';
import { createMemo, For, batch, Show, Accessor } from 'solid-js';
import { createStore } from 'solid-js/store';

import { FormHandlers, FormItem } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { Select, SelectState, Option } from '_common/components/Select';
import { useAddressSuggestions, formatSuggestion } from 'app/utils/useAddressSuggestions';
import { compose } from '_common/utils/compose';

import type { AddressValues } from './types';

import css from './AddressFormItems.css';

interface AddressFormItemsProps {
  values: Accessor<AddressValues>;
  errors: Readonly<Partial<Record<keyof AddressValues, string>>>;
  handlers: Readonly<FormHandlers<AddressValues>>;
}

type AutoComplete = 'on' | 'chrome-off';

export function AddressFormItems(props: Readonly<AddressFormItemsProps>) {
  const { loading, suggestions } = useAddressSuggestions(
    createMemo(() => {
      const data = props.values();
      return {
        address_prefix: data.streetLine1,
        city: data.locality,
        state: data.region,
        zip_code: data.postalCode,
      };
    }),
  );

  const onChangeStreetLine1 = (value: string) => {
    const found = suggestions().find((item) => formatSuggestion(item) === value);
    if (found) {
      batch(() => {
        props.handlers.streetLine1(found.primary_line);
        props.handlers.locality(found.city);
        props.handlers.region(found.state);
        props.handlers.postalCode(found.zip_code);
      });
    } else {
      props.handlers.streetLine1(value);
    }
  };

  const [autoComplete, setAutocomplete] = createStore<{
    streetLine1: AutoComplete;
    streetLine2: AutoComplete;
    locality: AutoComplete;
    region: AutoComplete;
    postalCode: AutoComplete;
  }>({
    streetLine1: 'on',
    streetLine2: 'on',
    locality: 'on',
    region: 'on',
    postalCode: 'on',
  });

  const setAutocompleteWrapper = (field: keyof typeof autoComplete) => (value: string) => {
    if (value.length === 0) {
      setAutocomplete(field, 'on');
    } else {
      setAutocomplete(field, 'chrome-off');
    }
  };

  return (
    <>
      <FormItem label={<Text message="Street address" />} error={props.errors.streetLine1} class={css.item}>
        <Show
          when={suggestions()}
          fallback={
            <Input
              class="fs-mask"
              autoComplete={autoComplete.streetLine1}
              name="streetLine1"
              value={props.values().streetLine1}
              error={Boolean(props.errors.streetLine1)}
              onChange={compose(props.handlers.streetLine1, setAutocompleteWrapper('streetLine1'))}
            />
          }
        >
          <Select
            class="fs-mask"
            autoComplete={autoComplete.streetLine1}
            name="streetLine1"
            value={props.values().streetLine1}
            error={Boolean(props.errors.streetLine1)}
            onChange={compose(onChangeStreetLine1, setAutocompleteWrapper('streetLine1'))}
            changeOnSearch
            loading={loading()}
          >
            <For each={suggestions()}>
              {(suggestion) => <Option value={formatSuggestion(suggestion)}>{formatSuggestion(suggestion)}</Option>}
            </For>
          </Select>
        </Show>
      </FormItem>
      <FormItem
        label={<Text message="Suite, apartment, unit, floor, etc." />}
        error={props.errors.streetLine2}
        class={css.item}
      >
        <Input
          class="fs-mask"
          autoComplete={autoComplete.streetLine2}
          name="streetLine2"
          type="text"
          value={props.values().streetLine2}
          error={Boolean(props.errors.streetLine2)}
          onChange={compose(props.handlers.streetLine2, setAutocompleteWrapper('streetLine2'))}
        />
      </FormItem>
      <FormItem label={<Text message="City" />} error={props.errors.locality} class={css.item}>
        <Input
          autoComplete={autoComplete.locality}
          name="locality"
          type="text"
          value={props.values().locality}
          error={Boolean(props.errors.locality)}
          onChange={compose(props.handlers.locality, setAutocompleteWrapper('locality'))}
        />
      </FormItem>
      <FormItem label={<Text message="State" />} error={props.errors.region} class={css.item}>
        <SelectState
          autoComplete={autoComplete.region}
          value={props.values().region}
          error={Boolean(props.errors.region)}
          onChange={compose(props.handlers.region, setAutocompleteWrapper('region'))}
        />
      </FormItem>
      <FormItem label={<Text message="ZIP Code" />} error={props.errors.postalCode} class={css.item}>
        <Input
          autoComplete={autoComplete.postalCode}
          name="postalCode"
          type="text"
          value={props.values().postalCode}
          maxLength={5}
          error={Boolean(props.errors.postalCode)}
          onChange={compose(props.handlers.postalCode, setAutocompleteWrapper('postalCode'))}
        />
      </FormItem>
    </>
  );
}
