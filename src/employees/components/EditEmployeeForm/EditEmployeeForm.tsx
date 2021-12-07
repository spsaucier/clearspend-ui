import { Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { Form, createForm, hasErrors } from '_common/components/Form';
import { useMessages } from 'app/containers/Messages/context';
import { PageActions } from 'app/components/Page';
import { Section } from 'app/components/Section';

import { AddressFormItems } from '../AddressFormItems/AddressFormItems';
import { PersonalInfoFormItems } from '../PersonalInfoFormItems/PersonalInfoFormItems';
import type { User } from '../../types';

import { getFormOptions } from './utils';
import type { FormValues } from './types';

interface EditEmployeeFormProps {
  user?: Readonly<User>;
  onSave: (employeeInfo: FormValues) => Promise<unknown>;
}

export function EditEmployeeForm(props: Readonly<EditEmployeeFormProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const { values, errors, isDirty, handlers, trigger, reset } = createForm<FormValues>(getFormOptions(props.user));

  const onSubmit = async () => {
    if (hasErrors(trigger())) return;
    const data = values();
    await props
      .onSave(data)
      .then(() => {
        if (props.user) reset(data);
      })
      .catch(() => {
        messages.error({ title: i18n.t('Something going wrong') });
      });
  };

  return (
    <Form>
      <Section title={<Text message="Employee Info" />} description="What is your employee's name and contact info?">
        <PersonalInfoFormItems values={values()} errors={errors()} handlers={handlers} />
      </Section>
      <Section title={<Text message="Employee Address" />} description="What's your employee’s home address?">
        <AddressFormItems values={values()} errors={errors()} handlers={handlers} />
      </Section>
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
