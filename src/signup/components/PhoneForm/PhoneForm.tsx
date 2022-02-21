import { onMount } from 'solid-js';

import { Form, FormItem, createForm } from '_common/components/Form';
import { validPhone } from '_common/components/Form/rules/patterns';
import { InputPhone } from '_common/components/InputPhone';
import { cleanPhone } from '_common/formatters/phone';
import { wrapAction } from '_common/utils/wrapAction';

import { Header } from '../Header';
import { Description } from '../Description';
import { FlatButton } from '../Button/FlatButton';

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
    if (!loading()) {
      next(cleanPhone(data.phone)).catch(() => setErrors({ phone: 'Something went wrong' }));
    }
  };

  return (
    <div>
      <Header>Where should we send a text to verify your mobile phone number?</Header>
      <Description>
        We promise your phone number will only be used for security and verification purposes and definitely not to call
        you when we get lonely
      </Description>
      <Form onSubmit={wrapSubmit(onSubmit)}>
        <FormItem label="Enter mobile phone number" error={errors().phone}>
          <InputPhone
            ref={input}
            name="phone"
            value={values().phone}
            error={Boolean(errors().phone)}
            onChange={handlers.phone}
            darkMode={true}
          />
        </FormItem>
        <FlatButton type="primary" htmlType="submit" loading={loading()}>
          Next
        </FlatButton>
      </Form>
    </div>
  );
}
