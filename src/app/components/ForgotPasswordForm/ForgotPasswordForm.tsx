import { createForm, Form, FormItem } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { wrapAction } from '_common/utils/wrapAction';
import { FlatButton } from 'signup/components/Button/FlatButton';

import css from '../LoginForm/LoginForm.css';
import { useMessages } from '../../containers/Messages/context';

interface FormValues {
  email: string;
}

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => Promise<unknown>;
  initialEmailValue?: string;
}

export function ForgotPasswordForm(props: Readonly<ForgotPasswordFormProps>) {
  const messages = useMessages();
  const [loading, submit] = wrapAction(props.onSubmit);

  const { values, errors, handlers, wrapSubmit } = createForm<FormValues>({
    defaultValues: { email: props.initialEmailValue || '' },
    rules: { email: [required] },
  });

  const onSubmit = (data: Readonly<FormValues>) => {
    if (!loading()) {
      submit(data.email)
        .then(() => {
          messages.success({
            title: 'Reset Password Success',
            message: 'If that user exists, an email was sent to that address with password reset instructions.',
          });
        })
        .catch((e: Error) => {
          messages.error({ title: 'Something went wrong', message: e.message });
        });
    }
  };

  return (
    <Form onSubmit={wrapSubmit(onSubmit)} class={css.form}>
      <FormItem label="Your email" error={errors().email}>
        <Input
          darkMode={true}
          name="email"
          type="email"
          value={values().email}
          error={Boolean(errors().email)}
          onChange={handlers.email}
        />
      </FormItem>
      <FlatButton type="primary" htmlType="submit" disabled={loading()} loading={loading()}>
        Send Password Reset
      </FlatButton>
    </Form>
  );
}
