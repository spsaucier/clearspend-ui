import { createForm } from 'solid-create-form';

import { useAddressSuggestions } from 'app/utils/useAddressSuggestions';
import { Button } from '_common/components/Button';
import { Form } from '_common/components/Form';

import type { FormValues } from '../EditEmployeeForm/types';
import { getFormOptions } from '../EditEmployeeForm/utils';

import { AddressFormItems } from './AddressFormItems';

export default {
  title: 'Composite/Form',
  component: AddressFormItems,
};

export const UserForm = () => {
  const { values, errors, isDirty, handlers, wrapSubmit } = createForm<FormValues>(getFormOptions());

  const onSubmit = (data: Readonly<FormValues>) => {
    // eslint-disable-next-line no-console
    console.log(data);
  };

  const { loading, suggestions } = useAddressSuggestions(values);

  return (
    <Form onSubmit={wrapSubmit(onSubmit)}>
      <div>
        <AddressFormItems
          values={values()}
          errors={errors()}
          handlers={handlers}
          suggestions={suggestions()}
          suggestionsLoading={loading()}
        />
      </div>
      <Button wide type="primary" htmlType="submit" icon={{ name: 'confirm', pos: 'right' }} disabled={!isDirty()}>
        Add employee
      </Button>
    </Form>
  );
};
