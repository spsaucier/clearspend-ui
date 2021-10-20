import { createSignal, Match, Switch } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';

import twLogo from 'app/assets/tw-logo.svg';
import { getNoop } from '_common/utils/getNoop';
import { formatPhone } from '_common/formatters/phone';
import { confirmOTP, signup, setPhone, setPassword } from 'onboarding/services/onboarding';
import { saveBusinessProspectID, readBusinessProspectID } from 'onboarding/storage';
import { IdentifierType } from 'onboarding/types';

import { Box } from './components/Box';
import { StartForm } from './components/StartForm';
import { EmailForm } from './components/EmailForm';
import { PhoneForm } from './components/PhoneForm';
import { VerifyForm } from './components/VerifyForm';
import { PasswordForm } from './components/PasswordForm';
import { saveSignupName } from './storage';

import css from './SignUp.css';

enum Step {
  name,
  email,
  emailConfirm,
  phone,
  phoneConfirm,
  password,
}

export default function SignUp() {
  const navigate = useNavigate();

  const [shared, setShared] = createSignal<string>('');
  const [step, setStep] = createSignal<Step>(Step.name);
  const next = () => setStep((prev) => prev + 1);

  let onSignup: (email: string) => Promise<unknown> = getNoop(true);

  const onNameUpdate = (firstName: string, lastName: string) => {
    saveSignupName({ firstName, lastName });

    onSignup = async (email: string) => {
      setShared(email);
      const resp = await signup({ email, firstName, lastName });
      saveBusinessProspectID(resp.businessProspectId);
      next();
    };
    next();
  };

  const onEmailConfirm = async (otp: string) => {
    await confirmOTP(readBusinessProspectID(), { identifierType: IdentifierType.EMAIL, otp });
    next();
  };

  const onPhoneUpdate = async (phone: string) => {
    setShared(phone);
    await setPhone(readBusinessProspectID(), phone);
    next();
  };

  const onPhoneConfirm = async (otp: string) => {
    await confirmOTP(readBusinessProspectID(), { identifierType: IdentifierType.PHONE, otp });
    next();
  };

  const onPasswordUpdate = async (password: string) => {
    await setPassword(readBusinessProspectID(), password);
    navigate('/onboarding');
  };

  return (
    <section class={css.root}>
      <header class={css.header}>
        <img src={twLogo} alt="Company logo" width={123} height={24} />
      </header>
      <div class={css.content}>
        <Box>
          <Switch>
            <Match when={step() === Step.name}>
              <StartForm onNext={onNameUpdate} />
            </Match>
            <Match when={step() === Step.email}>
              <EmailForm onNext={onSignup} />
            </Match>
            <Match when={step() === Step.emailConfirm}>
              <VerifyForm
                header="Verify your email"
                description={
                  <Text
                    message="We have sent a confirmation code to <b>{email}</b>"
                    b={(text) => <strong>{text}</strong>}
                    email={shared()}
                  />
                }
                // TODO: need API
                onResend={Promise.resolve}
                onConfirm={onEmailConfirm}
              />
            </Match>
            <Match when={step() === Step.phone}>
              <PhoneForm onNext={onPhoneUpdate} />
            </Match>
            <Match when={step() === Step.phoneConfirm}>
              <VerifyForm
                header="Verify your phone number"
                description={
                  <Text
                    message="We have sent a confirmation code to <b>{phone}</b>"
                    b={(text) => <strong>{text}</strong>}
                    phone={formatPhone(shared())}
                  />
                }
                // TODO: need API
                onResend={Promise.resolve}
                onConfirm={onPhoneConfirm}
              />
            </Match>
            <Match when={step() === Step.password}>
              <PasswordForm onCreateAccount={onPasswordUpdate} />
            </Match>
          </Switch>
        </Box>
      </div>
    </section>
  );
}
