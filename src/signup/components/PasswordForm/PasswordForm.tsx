import { onMount, Show, type JSXElement } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { Form, FormItem, createForm } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { wrapAction } from '_common/utils/wrapAction';

import { Header } from '../Header';
import { Description } from '../Description';
import { AgreementCheckbox } from '../AgreementCheckbox';
import { FlatButton } from '../Button/FlatButton';

import type { FormValues } from './types';
import { minLength, samePassword, PASSWORD_MIN_LENGTH } from './rules';

import css from './PasswordForm.css';

interface PasswordFormProps {
  agreement?: boolean;
  submitText: JSXElement;
  onPasswordUpdate: (password: string) => Promise<unknown>;
}

// TODO: Add visual password strength checking, or just rely on Reactor?
export function PasswordForm(props: Readonly<PasswordFormProps>) {
  let input!: HTMLInputElement;
  const i18n = useI18n();

  onMount(() => input.focus());

  const [loading, update] = wrapAction(props.onPasswordUpdate);

  const { values, errors, setErrors, handlers, wrapSubmit } = createForm<FormValues>({
    defaultValues: { password: '', confirm: '', agreement: false },
    rules: { password: [minLength], confirm: [samePassword], ...(props.agreement && { agreement: [required] }) },
  });

  const onSubmit = (data: Readonly<FormValues>) => {
    if (loading()) return;
    update(data.password).catch(() => {
      setErrors({ password: String(i18n.t('Something went wrong')) });
    });
  };

  return (
    <div>
      <Header>
        <Text message="Let's create a super secure, super secret password" />
      </Header>
      <Description>
        <Text
          message="Your password must be at least {count} {count, plural, one {character} other {characters}} long."
          count={PASSWORD_MIN_LENGTH}
        />
      </Description>
      <Form onSubmit={wrapSubmit(onSubmit)}>
        <FormItem label={<Text message="Password" />} error={errors().password}>
          <Input
            darkMode={true}
            ref={input}
            name="new-password"
            type="password"
            value={values().password}
            autoComplete="chrome-off"
            error={Boolean(errors().password)}
            class={css.input}
            onChange={handlers.password}
          />
        </FormItem>
        <FormItem label={<Text message="Confirm password" />} error={errors().confirm}>
          <Input
            darkMode={true}
            name="confirm-password"
            type="password"
            value={values().confirm}
            autoComplete="chrome-off"
            error={Boolean(errors().confirm)}
            class={css.input}
            onChange={handlers.confirm}
          />
        </FormItem>
        <Show when={props.agreement}>
          <FormItem error={errors().agreement}>
            <AgreementCheckbox value={values().agreement} onChange={handlers.agreement} />
          </FormItem>
        </Show>
        <FlatButton type="primary" htmlType="submit" loading={loading()}>
          {props.submitText}
        </FlatButton>
      </Form>
    </div>
  );
}
