import { onMount } from 'solid-js';

import { Form, FormItem, createForm } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { validEmail } from '_common/components/Form/rules/patterns';
import { Input } from '_common/components/Input';
import { Button } from '_common/components/Button';
import { wrapAction } from '_common/utils/wrapAction';

import { Header } from '../Header';
import { Description } from '../Description';

interface FormValues {
  email: string;
}

interface EmailFormProps {
  onNext: (email: string) => Promise<unknown>;
}

export function EmailForm(props: Readonly<EmailFormProps>) {
  let input!: HTMLInputElement;
  onMount(() => input.focus());

  const [loading, next] = wrapAction(props.onNext);

  const { values, errors, handlers, setErrors, wrapSubmit } = createForm<FormValues>({
    defaultValues: { email: '' },
    rules: { email: [required, validEmail] },
  });

  const onSubmit = (data: Readonly<FormValues>) => {
    if (!loading()) {
      next(data.email).catch(() => setErrors({ email: 'Something went wrong' }));
    }
  };

  return (
    <div>
      <Header>What email address do you use for work?</Header>
      <Description>We'll email you a confirmation code to verify your email address.</Description>
      <Form onSubmit={wrapSubmit(onSubmit)}>
        <FormItem label="Work email" error={errors().email}>
          <Input
            ref={input}
            name="email"
            type="email"
            value={values().email}
            error={Boolean(errors().email)}
            onChange={handlers.email}
          />
        </FormItem>
        <Button wide type="primary" htmlType="submit" loading={loading()}>
          Next
        </Button>
      </Form>
    </div>
  );
}
