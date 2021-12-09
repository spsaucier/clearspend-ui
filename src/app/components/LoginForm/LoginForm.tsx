import { createForm, Form, FormItem } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { Button } from '_common/components/Button';
import { wrapAction } from '_common/utils/wrapAction';

import { useMessages } from '../../containers/Messages/context';

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
        messages.error({ title: 'Something went wrong' });
      });
    }
  };

  return (
    <Form onSubmit={wrapSubmit(onSubmit)}>
      <FormItem label="Your email" error={errors().login}>
        <Input
          name="login"
          type="email"
          value={values().login}
          error={Boolean(errors().login)}
          onChange={handlers.login}
        />
      </FormItem>
      <FormItem label="Password" error={errors().password}>
        <Input
          name="password"
          type="password"
          value={values().password}
          error={Boolean(errors().password)}
          onChange={handlers.password}
        />
      </FormItem>
      <Button wide type="primary" htmlType="submit" loading={loading()}>
        Login
      </Button>
    </Form>
  );
}
