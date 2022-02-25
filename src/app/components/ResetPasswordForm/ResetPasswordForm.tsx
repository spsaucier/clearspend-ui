import { createForm, Form, FormItem } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { wrapAction } from '_common/utils/wrapAction';
import { minLength } from 'signup/components/PasswordForm/rules';
import { FlatButton } from 'signup/components/Button/FlatButton';

import { useMessages } from '../../containers/Messages/context';
import css from '../LoginForm/LoginForm.css';

interface FormValues {
  password: string;
}

interface ResetPasswordFormProps {
  onSubmit: (password: string) => Promise<unknown>;
}

export function ResetPasswordForm(props: Readonly<ResetPasswordFormProps>) {
  const messages = useMessages();
  const [loading, submit] = wrapAction(props.onSubmit);

  const { values, errors, handlers, wrapSubmit } = createForm<FormValues>({
    defaultValues: { password: '' },
    rules: { password: [required, minLength] },
  });

  const onSubmit = (data: Readonly<FormValues>) => {
    if (!loading()) {
      submit(data.password)
        .then(() => {
          messages.success({
            title: 'Reset Password Success',
            message: 'Your password has been successfully changed. You may now log in with your new password.',
          });
        })
        .catch((e: Error) => {
          // eslint-disable-next-line no-console
          console.info(e.message);
          messages.error({
            title: 'Something went wrong',
            message:
              'Perhaps your link is expired, or you entered a password you used previously. Please try the "Forgot Password" flow again.',
          });
        });
    }
  };

  return (
    <Form onSubmit={wrapSubmit(onSubmit)} class={css.form}>
      <FormItem label="New password" error={errors().password}>
        <Input
          darkMode={true}
          name="password"
          type="password"
          value={values().password}
          error={Boolean(errors().password)}
          onChange={handlers.password}
        />
      </FormItem>
      <FlatButton type="primary" htmlType="submit" disabled={loading()} loading={loading()}>
        Change Password
      </FlatButton>
    </Form>
  );
}
