import { onMount } from 'solid-js';
import { Text } from 'solid-i18n';

import { Form, FormItem, createForm } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { Button } from '_common/components/Button';
import { wrapAction } from '_common/utils/wrapAction';

import { Header } from '../Header';
import { Description } from '../Description';

import type { FormValues } from './types';
import { minLength, samePassword, PASSWORD_MIN_LENGTH } from './rules';

interface PasswordFormProps {
  onCreateAccount: (password: string) => Promise<unknown>;
}

// TODO: Add password strong checking
export function PasswordForm(props: Readonly<PasswordFormProps>) {
  let input!: HTMLInputElement;
  onMount(() => input.focus());

  const [loading, create] = wrapAction(props.onCreateAccount);

  const { values, errors, setErrors, handlers, wrapSubmit } = createForm<FormValues>({
    defaultValues: { password: '', confirm: '' },
    rules: { password: [minLength], confirm: [samePassword] },
  });

  const onSubmit = (data: Readonly<FormValues>) =>
    create(data.password).catch(() => {
      setErrors({ password: 'Something going wrong' });
    });

  return (
    <div>
      <Header>Create a password</Header>
      <Description>
        <Text
          message="Your password must be at least {count} {count, plural, one {character} other {characters}} long."
          count={PASSWORD_MIN_LENGTH}
        />
      </Description>
      <Form onSubmit={wrapSubmit(onSubmit)}>
        <FormItem label="Password" error={errors().password}>
          <Input
            ref={input}
            name="new-password"
            type="password"
            value={values().password}
            autoComplete="off"
            error={Boolean(errors().password)}
            onChange={handlers.password}
          />
        </FormItem>
        <FormItem label="Confirm password" error={errors().confirm}>
          <Input
            name="confirm-password"
            type="password"
            value={values().confirm}
            autoComplete="off"
            error={Boolean(errors().confirm)}
            onChange={handlers.confirm}
          />
        </FormItem>
        <Button wide type="primary" htmlType="submit" loading={loading()}>
          Create Account
        </Button>
      </Form>
    </div>
  );
}
