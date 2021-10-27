import { onMount } from 'solid-js';
import { Link } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { Form, FormItem, createForm } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { Button } from '_common/components/Button';

import { Header } from '../Header';
import { Description } from '../Description';

interface FormValues {
  firstName: string;
  lastName: string;
}

interface StartFormProps {
  onNext: (firstName: string, lastName: string) => void;
}

export function StartForm(props: Readonly<StartFormProps>) {
  let input!: HTMLInputElement;
  onMount(() => input.focus());

  const { values, errors, handlers, wrapSubmit } = createForm<FormValues>({
    defaultValues: { firstName: '', lastName: '' },
    rules: { firstName: [required], lastName: [required] },
  });

  const onSubmit = (data: Readonly<FormValues>) => props.onNext(data.firstName, data.lastName);

  return (
    <div>
      <Header>Get started</Header>
      <Description>
        <Text
          message="Already have an account? <link>Log in here</link>."
          link={(text) => <Link href="/login">{text}</Link>}
        />
      </Description>
      <Form onSubmit={wrapSubmit(onSubmit)}>
        <FormItem label="First name" error={errors().firstName}>
          <Input
            ref={input}
            name="first-name"
            value={values().firstName}
            error={Boolean(errors().firstName)}
            onChange={handlers.firstName}
          />
        </FormItem>
        <FormItem label="Last name" error={errors().lastName}>
          <Input
            name="last-name"
            value={values().lastName}
            error={Boolean(errors().lastName)}
            onChange={handlers.lastName}
          />
        </FormItem>
        <Button wide type="primary" htmlType="submit">
          Next
        </Button>
      </Form>
    </div>
  );
}
