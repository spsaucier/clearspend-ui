import { Button } from '_common/components/Button';
import { Form, FormItem, createForm } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { validEmail } from '_common/components/Form/rules/patterns';
import { Input } from '_common/components/Input';
import { wrapAction } from '_common/utils/wrapAction';
import { useMessages } from 'app/containers/Messages/context';

import css from './EditEmployeeFlatForm.css';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
}

interface EditEmployeeFlatFormProps {
  onSave: (first: string, last: string, email: string) => Promise<unknown>;
}

export function EditEmployeeFlatForm(props: Readonly<EditEmployeeFlatFormProps>) {
  const messages = useMessages();
  const [loading, save] = wrapAction(props.onSave);

  const { values, errors, isDirty, handlers, wrapSubmit } = createForm<FormValues>({
    defaultValues: { firstName: '', lastName: '', email: '' },
    rules: { firstName: [required], lastName: [required], email: [required, validEmail] },
  });

  const onSubmit = (data: Readonly<FormValues>) => {
    save(data.firstName, data.lastName, data.email).catch(() => {
      messages.error({ title: 'Something going wrong' });
    });
  };

  return (
    <Form class={css.root} onSubmit={wrapSubmit(onSubmit)}>
      <div>
        <FormItem label="First name" error={errors().firstName}>
          <Input
            name="first-name"
            value={values().firstName}
            placeholder="Enter first name"
            error={Boolean(errors().firstName)}
            onChange={handlers.firstName}
          />
        </FormItem>
        <FormItem label="Last name" error={errors().lastName}>
          <Input
            name="last-name"
            value={values().lastName}
            placeholder="Enter last name"
            error={Boolean(errors().lastName)}
            onChange={handlers.lastName}
          />
        </FormItem>
        <FormItem label="Company email address" error={errors().email}>
          <Input
            name="email"
            type="email"
            value={values().email}
            placeholder="Enter email address"
            error={Boolean(errors().email)}
            onChange={handlers.email}
          />
        </FormItem>
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
