import { createForm, Form, FormItem } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { wrapAction } from '_common/utils/wrapAction';
import { FlatButton } from 'signup/components/Button/FlatButton';

import { useMessages } from '../../containers/Messages/context';

import css from './LoginForm.css';

interface FormValues {
  login: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (login: string, password: string) => Promise<unknown>;
}

export function LoginForm(props: Readonly<LoginFormProps>) {
  const messages = useMessages();
  const [loading, submit] = wrapAction(props.onSubmit);

  const { values, errors, handlers, wrapSubmit } = createForm<FormValues>({
    defaultValues: { login: '', password: '' },
    rules: { login: [required], password: [required] },
  });

  const onSubmit = (data: Readonly<FormValues>) => {
    if (!loading()) {
      submit(data.login, data.password).catch(() => {
        messages.error({ title: 'Could not log in', message: 'Please try a different email or password' });
      });
    }
  };

  return (
    <Form onSubmit={wrapSubmit(onSubmit)} class={css.form}>
      <FormItem label="Your email" error={errors().login} darkMode={true}>
        <Input
          name="login"
          type="email"
          darkMode={true}
          value={values().login}
          error={Boolean(errors().login)}
          onChange={handlers.login}
        />
      </FormItem>
      <FormItem
        label="Password"
        error={errors().password}
        darkMode={true}
        extra={'New users: Please log in with the temporary password that was sent to your work email address.'}
      >
        <Input
          name="password"
          type="password"
          darkMode={true}
          value={values().password}
          error={Boolean(errors().password)}
          onChange={handlers.password}
        />
      </FormItem>
      <FlatButton type="primary" htmlType="submit" loading={loading()}>
        Log in
      </FlatButton>
    </Form>
  );
}
