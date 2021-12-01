import { Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { Form, FormItem, createForm, hasErrors } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { useMessages } from 'app/containers/Messages/context';
import { PageActions } from 'app/components/Page';

import type { User } from '../../types';

import { getFormOptions } from './utils';
import type { FormValues } from './types';

import css from './EditEmployeeForm.css';

interface EditEmployeeFormProps {
  user?: Readonly<User>;
  onSave: (first: string, last: string, email: string) => Promise<unknown>;
}

export function EditEmployeeForm(props: Readonly<EditEmployeeFormProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const { values, errors, isDirty, handlers, trigger, reset } = createForm<FormValues>(getFormOptions(props.user));

  const onSubmit = async () => {
    if (hasErrors(trigger())) return;
    const data = values();
    await props
      .onSave(data.firstName, data.lastName, data.email)
      .then(() => {
        if (props.user) reset(data);
      })
      .catch(() => {
        messages.error({ title: i18n.t('Something going wrong') });
      });
  };

  return (
    <Form>
      <div class={css.group}>
        <FormItem label={<Text message="First name" />} error={errors().firstName} class={css.name}>
          <Input
            name="first-name"
            value={values().firstName}
            placeholder={i18n.t('Enter first name') as string}
            error={Boolean(errors().firstName)}
            onChange={handlers.firstName}
          />
        </FormItem>
        <FormItem label={<Text message="Last name" />} error={errors().lastName} class={css.name}>
          <Input
            name="last-name"
            value={values().lastName}
            placeholder={i18n.t('Enter last name') as string}
            error={Boolean(errors().lastName)}
            onChange={handlers.lastName}
          />
        </FormItem>
      </div>
      <FormItem label={<Text message="Email address" />} error={errors().email} class={css.email}>
        <Input
          name="email"
          type="email"
          value={values().email}
          placeholder={i18n.t('Enter email address') as string}
          error={Boolean(errors().email)}
          onChange={handlers.email}
        />
      </FormItem>
      <Show when={isDirty()}>
        <PageActions
          action={
            <Show when={props.user} fallback={<Text message="Create Employee" />}>
              <Text message="Update Employee" />
            </Show>
          }
          onCancel={reset}
          onSave={onSubmit}
        />
      </Show>
    </Form>
  );
}
