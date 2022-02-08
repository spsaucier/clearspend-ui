import { useI18n, Text } from 'solid-i18n';

import { FormHandlers, FormItem } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { InputPhone } from '_common/components/InputPhone/InputPhone';

import type { FormValues } from '../EditEmployeeForm/types';

import css from './PersonalInfoFormItems.css';

interface PersonalInfoFormItemsProps {
  values: FormValues;
  errors: Readonly<Partial<Record<keyof FormValues, string>>>;
  handlers: Readonly<FormHandlers<FormValues>>;
}

export function PersonalInfoFormItems(props: Readonly<PersonalInfoFormItemsProps>) {
  const i18n = useI18n();

  return (
    <>
      <FormItem label={<Text message="First name*" />} error={props.errors.firstName} class={css.item}>
        <Input
          name="first-name"
          value={props.values.firstName}
          placeholder={String(i18n.t('Enter first name'))}
          error={Boolean(props.errors.firstName)}
          onChange={props.handlers.firstName}
        />
      </FormItem>
      <FormItem label={<Text message="Last name*" />} error={props.errors.lastName} class={css.item}>
        <Input
          name="last-name"
          value={props.values.lastName}
          placeholder={String(i18n.t('Enter last name'))}
          error={Boolean(props.errors.lastName)}
          onChange={props.handlers.lastName}
        />
      </FormItem>
      <FormItem label={<Text message="Email address*" />} error={props.errors.email} class={css.item}>
        <Input
          name="email"
          type="email"
          value={props.values.email}
          placeholder={String(i18n.t('Enter email address'))}
          error={Boolean(props.errors.email)}
          onChange={props.handlers.email}
        />
      </FormItem>
      <FormItem label={<Text message="Phone number" />} error={props.errors.phone} class={css.item}>
        <InputPhone
          name="phone"
          type="tel"
          value={props.values.phone}
          placeholder={String(i18n.t('Phone number'))}
          error={Boolean(props.errors.phone)}
          onChange={props.handlers.phone}
        />
      </FormItem>
    </>
  );
}
