import { Show } from 'solid-js';

import { join } from '_common/utils/join';
import { createForm } from '_common/components/Form';
import { AddressView } from '_common/components/AddressView';
import { RadioGroup, Radio } from '_common/components/Radio';
import { Button } from '_common/components/Button';
import type { Address } from 'generated/capital';

import { AddressFormItems, AddressValues } from '../AddressFormItems';

import { getFormOptions } from './utils';

import css from './AddressSelect.css';

interface AddressSelectProps {
  value?: Address;
  businessAddress?: Address;
  employeeAddress?: Address;
  class?: string;
  onChange?: (value: Address) => void;
}

enum Selected {
  Business = 'Business',
  Employee = 'Employee',
  New = 'New',
}

export function AddressSelect(props: Readonly<AddressSelectProps>) {
  const { values, errors, handlers } = createForm<AddressValues>(getFormOptions());

  const chooseSelectedAddress = (val?: Selected) => {
    switch (val) {
      case Selected.Business: {
        if (props.businessAddress) {
          props.onChange?.(props.businessAddress);
        }
        break;
      }
      case Selected.Employee: {
        if (props.employeeAddress) {
          props.onChange?.(props.employeeAddress);
        }
        break;
      }
      default: {
        props.onChange?.(values()!);
        break;
      }
    }
  };

  const handlersWithSave = {
    ...handlers,
    streetLine1: (value: string) => {
      handlers.streetLine1(value);
      setTimeout(() => chooseSelectedAddress());
    },
    streetLine2: (value: string) => {
      handlers.streetLine2(value);
      setTimeout(() => chooseSelectedAddress());
    },
    locality: (value: string) => {
      handlers.locality(value);
      setTimeout(() => chooseSelectedAddress());
    },
    region: (value: string) => {
      handlers.region(value);
      setTimeout(() => chooseSelectedAddress());
    },
    postalCode: (value: string) => {
      handlers.postalCode(value);
      setTimeout(() => chooseSelectedAddress());
    },
  };

  return (
    <RadioGroup
      empty
      name="card-type"
      value={props.value as string}
      class={join(css.root, props.class)}
      onChange={(val) => chooseSelectedAddress(val as Selected)}
    >
      <Show when={props.businessAddress}>
        <Radio value={Selected.Business} class={css.item}>
          <div class={css.content}>
            <AddressView address={props.businessAddress!} label="Business" icon="company" />
          </div>
        </Radio>
      </Show>
      <Show when={props.employeeAddress?.streetLine1}>
        <Radio value={Selected.Employee} class={css.item}>
          <div class={css.content}>
            <AddressView address={props.employeeAddress!} label="Employee" icon="user" />
          </div>
        </Radio>
      </Show>
      <Radio value={Selected.New} class={css.item}>
        <div class={css.specialContent}>
          <div class={css.showWhenInactive}>
            <Button icon="add" type="primary" view="ghost" class={css.noTouch}>
              New address
            </Button>
          </div>
          <div class={css.showWhenActive}>
            <AddressFormItems values={values} errors={errors()} handlers={handlersWithSave} />
          </div>
        </div>
      </Radio>
    </RadioGroup>
  );
}
