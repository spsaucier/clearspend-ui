import { useI18n, Text } from 'solid-i18n';
import { For, batch } from 'solid-js';

import { FormHandlers, FormItem } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { Select, SelectState, Option } from '_common/components/Select';
import type { Suggestion } from 'app/utils/addressService';

import type { FormValues } from '../EditEmployeeForm/types';
import css from '../EditEmployeeForm/EditEmployeeForm.css';

interface AddressFormItemsProps {
  values: FormValues;
  errors: Readonly<Partial<Record<keyof FormValues, string>>>;
  handlers: Readonly<FormHandlers<FormValues>>;
  suggestions?: Suggestion[];
}

export function AddressFormItems(props: Readonly<AddressFormItemsProps>) {
  const i18n = useI18n();
  let valueRender = () => {
    return props.values.streetLine1;
  };
  let onChangeStreetLine1 = props.handlers.streetLine1;
  if (props.suggestions) {
    onChangeStreetLine1 = (value) => {
      const found = props.suggestions?.find((s) => s.primary_line === value);
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
  }

  return (
    <>
      <FormItem label={<Text message="Street address" />} error={props.errors.streetLine1} class={css.item}>
        {props.suggestions ? (
          <Select
            name="streetLine1"
            value={props.values.streetLine1}
            placeholder={String(i18n.t('Street address'))}
            error={Boolean(props.errors.streetLine1)}
            onChange={onChangeStreetLine1}
            changeOnSearch
            valueRender={valueRender}
          >
            <For each={props.suggestions}>
              {(suggestion) => (
                <Option value={suggestion.primary_line}>
                  {`${suggestion.primary_line} ${suggestion.city}, ${suggestion.state} ${suggestion.zip_code}`}
                </Option>
              )}
            </For>
          </Select>
        ) : (
          <Input
            name="streetLine1"
            type="text"
            value={props.values.streetLine1}
            placeholder={String(i18n.t('Street address'))}
            error={Boolean(props.errors.streetLine1)}
            onChange={props.handlers.streetLine1}
          />
        )}
      </FormItem>
      <FormItem
        label={<Text message="Apartment, unit, floor, etc." />}
        error={props.errors.streetLine2}
        class={css.item}
      >
        <Input
          name="streetLine2"
          type="text"
          value={props.values.streetLine2}
          placeholder={String(i18n.t('Apartment'))}
          error={Boolean(props.errors.streetLine2)}
          onChange={props.handlers.streetLine2}
        />
      </FormItem>
      <FormItem label={<Text message="City" />} error={props.errors.locality} class={css.item}>
        <Input
          name="locality"
          type="text"
          value={props.values.locality}
          placeholder={String(i18n.t('City'))}
          error={Boolean(props.errors.locality)}
          onChange={props.handlers.locality}
        />
      </FormItem>
      <FormItem label={<Text message="State" />} error={props.errors.postalCode} class={css.item}>
        <SelectState
          value={props.values.region}
          error={Boolean(props.errors.region)}
          onChange={props.handlers.region}
        />
      </FormItem>
      <FormItem label={<Text message="ZIP Code" />} error={props.errors.postalCode} class={css.item}>
        <Input
          name="postalCode"
          type="text"
          value={props.values.postalCode}
          maxLength={5}
          placeholder={String(i18n.t('ZIP Code'))}
          error={Boolean(props.errors.postalCode)}
          onChange={props.handlers.postalCode}
        />
      </FormItem>
    </>
  );
}
