import { createSignal, Match, Switch } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';

import twLogo from 'app/assets/tw-logo.svg';
import { formatPhone } from '_common/formatters/phone';
import { confirmOTP, signup, setPhone, setPassword } from 'onboarding/services/onboarding';
import { ProspectStatus, IdentifierType } from 'onboarding/types';
import { ownerStore } from 'app/stores/owner';

import { Box } from './components/Box';
import { StartForm } from './components/StartForm';
import { EmailForm } from './components/EmailForm';
import { PhoneForm } from './components/PhoneForm';
import { VerifyForm } from './components/VerifyForm';
import { PasswordForm } from './components/PasswordForm';
import { useSignup, SignupStore } from './store';

import css from './SignUp.css';

enum Step {
  name,
  email,
  emailOtp,
  phone,
  phoneOtp,
  password,
}

function getInitStep(store: SignupStore): Step {
  const { first, last } = store;
  return !!first && !!last ? Step.email : Step.name;
}

export default function SignUp() {
  const navigate = useNavigate();

  const { store, setName, setEmail, setTel, cleanup } = useSignup();

  const [step, setStep] = createSignal<Step>(getInitStep(store));
  const next = () => setStep((prev) => prev + 1);

  const onNameUpdate = (firstName: string, lastName: string) => {
    setName(firstName, lastName);
    next();
  };

  const onSignup = async (email: string) => {
    const { first, last } = store;

    if (!first || !last) {
      setStep(Step.name);
      return;
    }

    const resp = await signup({ email, firstName: first, lastName: last });

    setEmail(email, resp.businessProspectId);

    switch (resp.businessProspectStatus) {
      case ProspectStatus.COMPLETED:
        cleanup();
        navigate('/login');
        break;
      case ProspectStatus.EMAIL_VERIFIED:
        setStep(Step.phone);
        break;
      case ProspectStatus.MOBILE_VERIFIED:
        setStep(Step.password);
        break;
      case ProspectStatus.NEW:
      default:
        setStep(Step.emailOtp);
    }
  };

  const onEmailCodeResend = async () => onSignup(store.email!);

  const onEmailConfirm = async (otp: string) => {
    await confirmOTP(store.pid!, { identifierType: IdentifierType.EMAIL, otp });
    next();
  };

  const onPhoneUpdate = async (phone: string) => {
    await setPhone(store.pid!, phone);
    setTel(phone);
    next();
  };

  const onPhoneCodeResend = async () => onPhoneUpdate(store.phone!);

  const onPhoneConfirm = async (otp: string) => {
    await confirmOTP(store.pid!, { identifierType: IdentifierType.PHONE, otp });
    next();
  };

  const onPasswordUpdate = async (password: string) => {
    await setPassword(store.pid!, password);
    await ownerStore.login(store.email!, password);
    cleanup();
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
            <Match when={step() === Step.emailOtp}>
              <VerifyForm
                header="Verify your email"
                description={<Text message="We have sent a confirmation code to <b>{email}</b>" email={store.email!} />}
                onResend={onEmailCodeResend}
                onConfirm={onEmailConfirm}
              />
            </Match>
            <Match when={step() === Step.phone}>
              <PhoneForm onNext={onPhoneUpdate} />
            </Match>
            <Match when={step() === Step.phoneOtp}>
              <VerifyForm
                header="Verify your phone number"
                description={
                  <Text
                    message="We have sent a confirmation code to <b>{phone}</b>"
                    phone={formatPhone(store.phone!)}
                  />
                }
                onResend={onPhoneCodeResend}
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
