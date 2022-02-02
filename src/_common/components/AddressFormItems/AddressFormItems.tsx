import { useI18n, Text } from 'solid-i18n';
import { For, batch, Show, Accessor } from 'solid-js';

import { FormHandlers, FormItem } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { Select, SelectState, Option } from '_common/components/Select';
import { useAddressSuggestions } from 'app/utils/useAddressSuggestions';

import type { AddressValues } from './types';

import css from './AddressFormItems.css';

interface AddressFormItemsProps {
  values: Accessor<AddressValues>;
  errors: Readonly<Partial<Record<keyof AddressValues, string>>>;
  handlers: Readonly<FormHandlers<AddressValues>>;
}

export function AddressFormItems(props: Readonly<AddressFormItemsProps>) {
  const { loading, suggestions } = useAddressSuggestions(props.values);
  const i18n = useI18n();
  let valueRender = () => {
    return props.values().streetLine1;
  };
  const onChangeStreetLine1 = (value: string) => {
    const found = suggestions().find((s) => s.primary_line === value);
    if (found) {
      batch(() => {
        props.handlers.streetLine1(value);
        props.handlers.locality(found.city);
        props.handlers.region(found.state);
        props.handlers.postalCode(found.zip_code);
      });
    } else {
      props.handlers.streetLine1(value);
    }
  };

  return (
    <>
      <FormItem label={<Text message="Street address" />} error={props.errors.streetLine1} class={css.item}>
        <Show
          when={suggestions()}
          fallback={
            <Input
              name="streetLine1"
              type="text"
              value={props.values().streetLine1}
              placeholder={String(i18n.t('Street address'))}
              error={Boolean(props.errors.streetLine1)}
              onChange={props.handlers.streetLine1}
            />
          }
        >
          <Select
            name="streetLine1"
            value={props.values().streetLine1}
            placeholder={String(i18n.t('Street address'))}
            error={Boolean(props.errors.streetLine1)}
            onChange={onChangeStreetLine1}
            changeOnSearch
            valueRender={valueRender}
            loading={loading()}
          >
            <For each={suggestions()}>
              {(suggestion) => (
                <Option value={suggestion.primary_line}>
                  {`${suggestion.primary_line} ${suggestion.city}, ${suggestion.state} ${suggestion.zip_code}`}
                </Option>
              )}
            </For>
          </Select>
        </Show>
      </FormItem>
      <FormItem
        label={<Text message="Apartment, unit, floor, etc." />}
        error={props.errors.streetLine2}
        class={css.item}
      >
        <Input
          name="streetLine2"
          type="text"
          value={props.values().streetLine2}
          placeholder={String(i18n.t('Apartment'))}
          error={Boolean(props.errors.streetLine2)}
          onChange={props.handlers.streetLine2}
        />
      </FormItem>
      <FormItem label={<Text message="City" />} error={props.errors.locality} class={css.item}>
        <Input
          name="locality"
          type="text"
          value={props.values().locality}
          placeholder={String(i18n.t('City'))}
          error={Boolean(props.errors.locality)}
          onChange={props.handlers.locality}
        />
      </FormItem>
      <FormItem label={<Text message="State" />} error={props.errors.postalCode} class={css.item}>
        <SelectState
          value={props.values().region}
          error={Boolean(props.errors.region)}
          onChange={props.handlers.region}
        />
      </FormItem>
      <FormItem label={<Text message="ZIP Code" />} error={props.errors.postalCode} class={css.item}>
        <Input
          name="postalCode"
          type="text"
          value={props.values().postalCode}
          maxLength={5}
          placeholder={String(i18n.t('ZIP Code'))}
          error={Boolean(props.errors.postalCode)}
          onChange={props.handlers.postalCode}
        />
      </FormItem>
    </>
  );
}
