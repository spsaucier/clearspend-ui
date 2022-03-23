import { createSignal, createEffect, Show, untrack } from 'solid-js';
import { Text } from 'solid-i18n';

import { join } from '_common/utils/join';
import { createForm } from '_common/components/Form';
import { AddressView } from '_common/components/AddressView';
import { RadioGroup, Radio } from '_common/components/Radio';
import { Button } from '_common/components/Button';
import type { Address } from 'generated/capital';

import { AddressFormItems, AddressValues } from '../AddressFormItems';
import { getEmptyAddress } from '../AddressFormItems/utils';

import css from './AddressSelect.css';

enum AddressType {
  Business = 'Business',
  Employee = 'Employee',
  New = 'New',
}

interface AddressSelectProps {
  businessAddress: Address | undefined;
  employeeAddress: Address | undefined;
  class?: string;
  onChange: (value: Address) => void;
}

export function AddressSelect(props: Readonly<AddressSelectProps>) {
  const [addressType, setAddressType] = createSignal<AddressType>();

  const { values, errors, handlers } = createForm<AddressValues>({
    defaultValues: getEmptyAddress(),
  });

  const onChangeAddressType = (val: AddressType): void => {
    setAddressType(val);
    switch (val) {
      case AddressType.Business:
        return props.onChange(props.businessAddress!);
      case AddressType.Employee:
        return props.onChange(props.employeeAddress!);
      case AddressType.New:
      default:
        return props.onChange(values());
    }
  };

  createEffect(() => {
    const formValues = { ...values() };
    if (untrack(addressType) !== AddressType.New) return;
    setTimeout(() => props.onChange(formValues));
  });

  return (
    <RadioGroup
      empty
      name="delivery-address-type"
      value={addressType()}
      class={join(css.root, props.class)}
      onChange={onChangeAddressType}
    >
      <Show when={props.businessAddress}>
        <Radio value={AddressType.Business} class={css.item}>
          <div class={css.content}>
            <AddressView address={props.businessAddress!} label={<Text message="Business" />} icon="company" />
          </div>
        </Radio>
      </Show>
      <Show when={props.employeeAddress?.streetLine1}>
        <Radio value={AddressType.Employee} class={css.item}>
          <div class={css.content}>
            <AddressView address={props.employeeAddress!} label={<Text message="Employee" />} icon="user" />
          </div>
        </Radio>
      </Show>
      <Radio value={AddressType.New} class={css.item}>
        <div class={css.specialContent}>
          <div class={css.showWhenInactive}>
            <Button icon="add" type="primary" view="ghost" class={css.noTouch}>
              <Text message="New address" />
            </Button>
          </div>
          <div class={css.showWhenActive}>
            <AddressFormItems values={values} errors={errors()} handlers={handlers} />
          </div>
        </div>
      </Radio>
    </RadioGroup>
  );
}
