import { onMount } from 'solid-js';
import { Link } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { Form, FormItem, createForm } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { validEmail } from '_common/components/Form/rules/patterns';
import { wrapAction } from '_common/utils/wrapAction';
import { useSignup } from 'signup/store';
import { Checkbox } from '_common/components/Checkbox';

import { Header } from '../Header';
import { Description } from '../Description';
import { FlatButton } from '../Button/FlatButton';

interface AccountSetUpFormValues {
  firstName: string;
  lastName: string;
  email: string;
  isAgreedToTos: boolean;
}

interface AccountSetUpFormProps {
  onNext: (firstName: string, lastName: string, email: string) => Promise<void>;
  initialEmailValue?: string;
}

export function AccountSetUpForm(props: Readonly<AccountSetUpFormProps>) {
  let input!: HTMLInputElement;
  onMount(() => input.focus());
  const { store } = useSignup();

  const { values, errors, handlers, setErrors, wrapSubmit } = createForm<AccountSetUpFormValues>({
    defaultValues: {
      firstName: store.first ?? '',
      lastName: store.last ?? '',
      email: store.email ?? (props.initialEmailValue || ``),
      isAgreedToTos: false,
    },
    rules: { firstName: [required], lastName: [required], email: [required, validEmail], isAgreedToTos: [required] },
  });

  const [loading, next] = wrapAction(props.onNext);

  // const onSubmit = (data: Readonly<AccountSetUpFormValues>) => props.onNext(data.firstName, data.lastName, data.email);
  const onSubmit = (data: Readonly<AccountSetUpFormValues>) => {
    if (!loading()) {
      next(data.firstName, data.lastName, data.email).catch(() => setErrors({ email: 'Something went wrong' }));
    }
  };

  return (
    <div>
      <Header>Let's get your account set up</Header>
      <Description>
        <Text message="It's easier than buying a car, (and less painful), we promise." />
      </Description>
      <Form onSubmit={wrapSubmit(onSubmit)}>
        <FormItem label="First name" error={errors().firstName} darkMode={true}>
          <Input
            ref={input}
            darkMode={true}
            name="first-name"
            value={values().firstName}
            error={Boolean(errors().firstName)}
            onChange={handlers.firstName}
          />
        </FormItem>
        <FormItem label="Last name" error={errors().lastName} darkMode={true}>
          <Input
            darkMode={true}
            name="last-name"
            value={values().lastName}
            error={Boolean(errors().lastName)}
            onChange={handlers.lastName}
          />
        </FormItem>
        <FormItem
          darkMode={true}
          label="Work email"
          error={errors().email}
          extra={
            'We’ll send you a confirmation email just to make sure you’re human and not some distant planet invader looking to expense their UFO repairs on Earth'
          }
        >
          <Input
            darkMode={true}
            name="email"
            type="email"
            value={values().email}
            error={Boolean(errors().email)}
            onChange={handlers.email}
          />
        </FormItem>
        <FormItem error={errors().isAgreedToTos} class={'fullwidth'}>
          <Checkbox value={'agree'} onChange={handlers.isAgreedToTos}>
            <Text
              message="I am at least 18 years old and agree to ClearSpend’s <linkToS>Terms of Service</linkToS> and <linkPP>Privacy Policy</linkPP>."
              linkToS={(text) => <Link href="/login">{text}</Link>}
              linkPP={(text) => <Link href="/login">{text}</Link>}
            />
          </Checkbox>
        </FormItem>
        <FlatButton type="primary" htmlType="submit">
          Next
        </FlatButton>
        <div style={{ 'margin-top': '24px' }}>
          <Text
            message="Already have an account? <link>Log in here</link>."
            link={(text) => (
              <Link href="/login">
                <b>{text}</b>
              </Link>
            )}
          />
        </div>
      </Form>
    </div>
  );
}
