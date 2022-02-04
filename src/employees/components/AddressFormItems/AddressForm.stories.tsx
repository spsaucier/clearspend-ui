import { createForm } from 'solid-create-form';

import { Button } from '_common/components/Button';
import { Form } from '_common/components/Form';

import { getFormOptions } from '../AddressSelect/utils';

import { AddressFormItems } from './AddressFormItems';
import type { AddressValues } from './types';

export default {
  title: 'Composite/Form',
  component: AddressFormItems,
};

export const UserForm = () => {
  const { values, errors, isDirty, handlers, wrapSubmit } = createForm<AddressValues>(getFormOptions());

  const onSubmit = (data: Readonly<AddressValues>) => {
    // eslint-disable-next-line no-console
    console.log(data);
  };

  return (
    <Form onSubmit={wrapSubmit(onSubmit)}>
      <div>
        <AddressFormItems values={values} errors={errors()} handlers={handlers} />
      </div>
      <Button wide type="primary" htmlType="submit" icon={{ name: 'confirm', pos: 'right' }} disabled={!isDirty()}>
        Add employee
      </Button>
    </Form>
  );
};
