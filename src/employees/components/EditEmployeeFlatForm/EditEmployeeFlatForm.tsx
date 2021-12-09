import { Button } from '_common/components/Button';
import { Form, createForm } from '_common/components/Form';
import { wrapAction } from '_common/utils/wrapAction';
import { useMessages } from 'app/containers/Messages/context';

import { PersonalInfoFormItems } from '../PersonalInfoFormItems/PersonalInfoFormItems';
import { AddressFormItems } from '../AddressFormItems/AddressFormItems';
import type { FormValues } from '../EditEmployeeForm/types';
import { getFormOptions } from '../EditEmployeeForm/utils';

import css from './EditEmployeeFlatForm.css';

interface EditEmployeeFlatFormProps {
  onSave: (first: string, last: string, email: string) => Promise<unknown>;
}

export function EditEmployeeFlatForm(props: Readonly<EditEmployeeFlatFormProps>) {
  const messages = useMessages();
  const [loading, save] = wrapAction(props.onSave);

  const { values, errors, isDirty, handlers, wrapSubmit } = createForm<FormValues>(getFormOptions());

  const onSubmit = (data: Readonly<FormValues>) => {
    if (!loading()) {
      save(data.firstName, data.lastName, data.email).catch(() => {
        messages.error({ title: 'Something went wrong' });
      });
    }
  };

  return (
    <Form class={css.root} onSubmit={wrapSubmit(onSubmit)}>
      <div>
        <PersonalInfoFormItems values={values()} errors={errors()} handlers={handlers} />
        <AddressFormItems values={values()} errors={errors()} handlers={handlers} />
      </div>
      <Button
        wide
        type="primary"
        htmlType="submit"
        icon={{ name: 'confirm', pos: 'right' }}
        loading={loading()}
        disabled={!isDirty()}
      >
        Add employee
      </Button>
    </Form>
  );
}
