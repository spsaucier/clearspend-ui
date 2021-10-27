import { Show } from 'solid-js';

import { Form, FormItem, createForm } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { validEmail } from '_common/components/Form/rules/patterns';
import { Input } from '_common/components/Input';
import { useMessages } from 'app/containers/Messages/context';
import { PageActions } from 'app/components/Page';

import css from './EditEmployeeForm.css';

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
}

interface EditEmployeeFormProps {
  onSave: (first: string, last: string, email: string) => Promise<unknown>;
}

export function EditEmployeeForm(props: Readonly<EditEmployeeFormProps>) {
  const messages = useMessages();

  const { values, errors, isDirty, handlers, reset } = createForm<FormValues>({
    defaultValues: { firstName: '', lastName: '', email: '' },
    rules: { firstName: [required], lastName: [required], email: [required, validEmail] },
  });

  const onSubmit = async () => {
    // TODO
    const data = values();
    await props.onSave(data.firstName, data.lastName, data.email).catch(() => {
      messages.error({ title: 'Something going wrong' });
    });
  };

  return (
    <Form>
      <div class={css.group}>
        <FormItem label="First name" error={errors().firstName} class={css.name}>
          <Input
            name="first-name"
            value={values().firstName}
            placeholder="Enter first name"
            error={Boolean(errors().firstName)}
            onChange={handlers.firstName}
          />
        </FormItem>
        <FormItem label="Last name" error={errors().lastName} class={css.name}>
          <Input
            name="last-name"
            value={values().lastName}
            placeholder="Enter last name"
            error={Boolean(errors().lastName)}
            onChange={handlers.lastName}
          />
        </FormItem>
      </div>
      <FormItem label="Company email address" error={errors().email} class={css.email}>
        <Input
          name="email"
          type="email"
          value={values().email}
          placeholder="Enter email address"
          error={Boolean(errors().email)}
          onChange={handlers.email}
        />
      </FormItem>
      <Show when={isDirty()}>
        <PageActions action="Create Employee" onCancel={reset} onSave={onSubmit} />
      </Show>
    </Form>
  );
}
