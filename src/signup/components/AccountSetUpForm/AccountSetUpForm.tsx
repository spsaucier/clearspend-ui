import { onMount } from 'solid-js';
import { Text } from 'solid-i18n';

import { Link } from '_common/components/Link';
import { Form, FormItem, createForm } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { Input } from '_common/components/Input';
import { validEmail } from '_common/components/Form/rules/patterns';
import { wrapAction } from '_common/utils/wrapAction';
import { useSignup } from 'signup/store';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';

import { Header } from '../Header';
import { Description } from '../Description';
import { AgreementCheckbox } from '../AgreementCheckbox';
import { FlatButton } from '../Button/FlatButton';

import css from './AccountSetUpForm.css';

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
  sendAnalyticsEvent({ name: Events.VIEW_SIGNUP });
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
      <Header>
        <Text message="Let's get your account set up" />
      </Header>
      <Description>
        <Text message="It's easier than buying a car (and less painful), we promise." />
      </Description>
      <Form onSubmit={wrapSubmit(onSubmit)}>
        <FormItem darkMode label={<Text message="First name" />} error={errors().firstName}>
          <Input
            ref={input}
            darkMode={true}
            name="first-name"
            value={values().firstName}
            error={Boolean(errors().firstName)}
            onChange={handlers.firstName}
          />
        </FormItem>
        <FormItem darkMode label={<Text message="Last name" />} error={errors().lastName}>
          <Input
            darkMode={true}
            name="last-name"
            value={values().lastName}
            error={Boolean(errors().lastName)}
            onChange={handlers.lastName}
          />
        </FormItem>
        <FormItem
          darkMode
          label={<Text message="Work email" />}
          error={errors().email}
          extra={
            <Text
              message={
                'We’ll send you a confirmation email just to make sure you’re human ' +
                'and not some distant planet invader looking to expense their UFO repairs on Earth'
              }
            />
          }
        >
          <Input
            darkMode
            name="email"
            type="email"
            value={values().email}
            error={Boolean(errors().email)}
            onChange={handlers.email}
          />
        </FormItem>
        <FormItem error={errors().isAgreedToTos} class="fullwidth">
          <AgreementCheckbox value={values().isAgreedToTos} onChange={handlers.isAgreedToTos} />
        </FormItem>
        <FlatButton type="primary" htmlType="submit">
          <Text message="Next" />
        </FlatButton>
        <div class={css.haveAccount}>
          <Text
            message="Already have an account? <link>Log in here</link>."
            link={(text) => (
              <Link darkMode href="/login">
                <b>{text}</b>
              </Link>
            )}
          />
        </div>
      </Form>
    </div>
  );
}
