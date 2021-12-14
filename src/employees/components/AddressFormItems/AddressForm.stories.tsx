import { createForm } from 'solid-create-form';
import { createSignal, createEffect } from 'solid-js';
import createDebounce from '@solid-primitives/debounce';

import { getAddresses, Suggestion, SuggestionsResponse } from 'app/utils/addressService';
import { Button } from '_common/components/Button';
import { Form } from '_common/components/Form';

import type { FormValues } from '../EditEmployeeForm/types';
import { getFormOptions } from '../EditEmployeeForm/utils';

import { AddressFormItems } from './AddressFormItems';

export default {
  title: 'Composite/Form',
  component: AddressFormItems,
};

const DEBOUNCE_MS = 1000;
const MIN_CHARS = 3;

export const UserForm = () => {
  const { values, errors, isDirty, handlers, wrapSubmit } = createForm<FormValues>(getFormOptions());

  const onSubmit = (data: Readonly<FormValues>) => {
    // eslint-disable-next-line no-console
    console.log(data);
  };

  const [suggestions, setSuggestions] = createSignal<Suggestion[]>([]);

  const getAddressData = async () => {
    const data = (await getAddresses(values())).data as SuggestionsResponse;
    setSuggestions(data.suggestions);
  };

  const [trigger, clear] = createDebounce(getAddressData, DEBOUNCE_MS);

  createEffect(() => {
    if (values().streetLine1.length > MIN_CHARS) {
      trigger();
    } else {
      setSuggestions([]);
      clear();
    }
  });

  return (
    <Form onSubmit={wrapSubmit(onSubmit)}>
      <div>
        <AddressFormItems values={values()} errors={errors()} handlers={handlers} suggestions={suggestions()} />
      </div>
      <Button wide type="primary" htmlType="submit" icon={{ name: 'confirm', pos: 'right' }} disabled={!isDirty()}>
        Add employee
      </Button>
    </Form>
  );
};
