import { onMount } from 'solid-js';

import { Form, FormItem, createForm } from '_common/components/Form';
import { validPhone } from '_common/components/Form/rules/patterns';
import { Input } from '_common/components/Input';
import { Button } from '_common/components/Button';
import { cleanPhone, formatPhone } from '_common/formatters/phone';
import { wrapAction } from '_common/utils/wrapAction';

import { Header } from '../Header';
import { Description } from '../Description';

interface FormValues {
  phone: string;
}

interface PhoneFormProps {
  onNext: (phone: string) => Promise<unknown>;
}

export function PhoneForm(props: Readonly<PhoneFormProps>) {
  let input!: HTMLInputElement;
  onMount(() => input.focus());

  const [loading, next] = wrapAction(props.onNext);

  const { values, errors, handlers, setErrors, wrapSubmit } = createForm<FormValues>({
    defaultValues: { phone: '' },
    rules: { phone: [(val) => validPhone(cleanPhone(val))] },
  });

  const onSubmit = (data: Readonly<FormValues>) => {
    next(cleanPhone(data.phone)).catch(() => setErrors({ phone: 'Something going wrong' }));
  };

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
            formatter={formatPhone}
            value={values().phone}
            error={Boolean(errors().phone)}
            onChange={handlers.phone}
          />
        </FormItem>
        <Button wide type="primary" htmlType="submit" loading={loading()}>
          Next
        </Button>
      </Form>
    </div>
  );
}
