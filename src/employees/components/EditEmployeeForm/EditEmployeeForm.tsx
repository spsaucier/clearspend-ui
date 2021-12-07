import { Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { Form, FormItem, createForm, hasErrors } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { SelectState } from '_common/components/Select';
import { useMessages } from 'app/containers/Messages/context';
import { PageActions } from 'app/components/Page';
import { Section } from 'app/components/Section';

import type { User } from '../../types';
import { InputPhone } from '../../../_common/components/InputPhone/InputPhone';

import { getFormOptions } from './utils';
import type { FormValues } from './types';

import css from './EditEmployeeForm.css';

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
      <Section title={<Text message="Employee Info" />} description="What are your employee's name and contact info?">
        <FormItem label={<Text message="First name" />} error={errors().firstName} class={css.item}>
          <Input
            name="first-name"
            value={values().firstName}
            placeholder={i18n.t('Enter first name') as string}
            error={Boolean(errors().firstName)}
            onChange={handlers.firstName}
          />
        </FormItem>
        <FormItem label={<Text message="Last name" />} error={errors().lastName} class={css.item}>
          <Input
            name="last-name"
            value={values().lastName}
            placeholder={i18n.t('Enter last name') as string}
            error={Boolean(errors().lastName)}
            onChange={handlers.lastName}
          />
        </FormItem>
        <FormItem label={<Text message="Email address" />} error={errors().email} class={css.item}>
          <Input
            name="email"
            type="email"
            value={values().email}
            placeholder={i18n.t('Enter email address') as string}
            error={Boolean(errors().email)}
            onChange={handlers.email}
          />
        </FormItem>
        <FormItem label={<Text message="Phone number" />} error={errors().phone} class={css.item}>
          <InputPhone
            name="phone"
            type="tel"
            value={values().phone}
            placeholder={i18n.t('Phone number') as string}
            error={Boolean(errors().phone)}
            onChange={handlers.phone}
          />
        </FormItem>
      </Section>
      <Section title={<Text message="Employee Address" />} description="What's your employee’s home address?">
        <FormItem label={<Text message="Street address" />} error={errors().streetLine1} class={css.item}>
          <Input
            name="streetLine1"
            type="text"
            value={values().streetLine1}
            placeholder={i18n.t('Street address') as string}
            error={Boolean(errors().streetLine1)}
            onChange={handlers.streetLine1}
          />
        </FormItem>
        <FormItem label={<Text message="Apartment, unit, floor, etc." />} error={errors().streetLine2} class={css.item}>
          <Input
            name="streetLine2"
            type="text"
            value={values().streetLine2}
            placeholder={i18n.t('Apartment') as string}
            error={Boolean(errors().streetLine2)}
            onChange={handlers.streetLine2}
          />
        </FormItem>
        <FormItem label={<Text message="City" />} error={errors().locality} class={css.item}>
          <Input
            name="locality"
            type="text"
            value={values().locality}
            placeholder={i18n.t('City') as string}
            error={Boolean(errors().locality)}
            onChange={handlers.locality}
          />
        </FormItem>
        <FormItem label={<Text message="State" />} error={errors().postalCode} class={css.item}>
          <SelectState value={values().region} error={Boolean(errors().region)} onChange={handlers.region} />
        </FormItem>
        <FormItem label={<Text message="ZIP Code" />} error={errors().postalCode} class={css.item}>
          <Input
            name="postalCode"
            type="text"
            value={values().postalCode}
            placeholder={i18n.t('ZIP Code') as string}
            error={Boolean(errors().postalCode)}
            onChange={handlers.postalCode}
          />
        </FormItem>
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
