import { createForm, Form, FormItem } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { Button } from '_common/components/Button';
import { wrapAction } from '_common/utils/wrapAction';

interface FormValues {
  login: string;
  password: string;
}

interface LoginFormProps {
  onSubmit: (login: string, password: string) => Promise<unknown>;
}

export function LoginForm(props: Readonly<LoginFormProps>) {
  const [loading, submitAction] = wrapAction(props.onSubmit);

  const { values, errors, isDirty, handlers, wrapSubmit } = createForm<FormValues>({
    defaultValues: { login: '', password: '' },
    rules: { login: [required], password: [required] },
  });

  const onSubmit = (data: Readonly<FormValues>) => {
    submitAction(data.login, data.password)
      .then(() => {
        // TODO
      })
      .catch(() => {
        // TODO
      });
  };

  return (
    <Form onSubmit={wrapSubmit(onSubmit)}>
      <FormItem label="Your email or mobile number" error={errors().login}>
        <Input
          name="login"
          placeholder="Enter your Email or Mobile Number"
          value={values().login}
          error={Boolean(errors().login)}
          onChange={handlers.login}
        />
      </FormItem>
      <FormItem label="Password" error={errors().password}>
        <Input
          name="password"
          type="password"
          placeholder="Enter your Password"
          value={values().password}
          error={Boolean(errors().password)}
          onChange={handlers.password}
        />
      </FormItem>
      <Button htmlType="submit" loading={loading()} disabled={!isDirty()}>
        Login
      </Button>
    </Form>
  );
}
