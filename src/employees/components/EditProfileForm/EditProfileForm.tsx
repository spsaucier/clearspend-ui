import { Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { createForm, hasErrors, Form } from '_common/components/Form';
import { validStreetLine1 } from '_common/components/Form/rules/patterns';
import { PageActions } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { useMessages } from 'app/containers/Messages/context';
import type { User, CreateUserRequest } from 'generated/capital';

import { AddressFormItems, AddressValues } from '../AddressFormItems';

interface EditProfileFormProps {
  user: Readonly<Required<User>>;
  onUpdate: (params: Readonly<CreateUserRequest>) => Promise<void>;
}

export function EditProfileForm(props: Readonly<EditProfileFormProps>) {
  const i18n = useI18n();
  const messages = useMessages();

  const { values, errors, isDirty, handlers, trigger, reset } = createForm<AddressValues>({
    defaultValues: {
      streetLine1: props.user.address.streetLine1 || '',
      streetLine2: props.user.address.streetLine2 || '',
      locality: props.user.address.locality || '',
      region: props.user.address.region || '',
      postalCode: props.user.address.postalCode || '',
    },
    rules: { streetLine1: [validStreetLine1] },
  });

  const onSubmit = async () => {
    if (hasErrors(trigger())) return;
    await props.onUpdate({ ...props.user, address: { ...props.user.address, ...values() } }).catch(() => {
      messages.error({ title: i18n.t('Something went wrong') });
    });
  };

  return (
    <Form>
      <Section title={<Text message="Employee address" />} description={'What’s your employee’s home address?'}>
        <AddressFormItems values={values} errors={errors()} handlers={handlers} />
      </Section>
      <Show when={isDirty()}>
        <PageActions action={<Text message="Update Address" />} onCancel={reset} onSave={onSubmit} />
      </Show>
    </Form>
  );
}
