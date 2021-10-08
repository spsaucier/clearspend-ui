import { onMount } from 'solid-js';

import { Form, FormItem, createForm } from '_common/components/Form';
import { Input } from '_common/components/Input';
import { Button } from '_common/components/Button';

import { Header } from '../Header';
import { Description } from '../Description';

import { minLength } from './rules';

interface FormValues {
  phone: string;
}

interface PhoneFormProps {
  onNext: (phone: string) => void;
}

export function PhoneForm(props: Readonly<PhoneFormProps>) {
  let input!: HTMLInputElement;
  onMount(() => input.focus());

  const { values, errors, handlers, wrapSubmit } = createForm<FormValues>({
    defaultValues: { phone: '' },
    rules: { phone: [minLength] }, // TODO: add rules
  });

  const onSubmit = (data: Readonly<FormValues>) => props.onNext(data.phone);

  return (
    <div>
      <Header>What is your mobile phone number?</Header>
      <Description>Your phone number will only be used for security.</Description>
      <Form onSubmit={wrapSubmit(onSubmit)}>
        <FormItem label="Enter mobile phone number" error={errors().phone}>
          <Input
            ref={input}
            name="phone"
            type="tel"
            value={values().phone}
            error={Boolean(errors().phone)}
            onChange={handlers.phone}
          />
        </FormItem>
        <Button wide type="primary" htmlType="submit">
          Next
        </Button>
      </Form>
    </div>
  );
}
