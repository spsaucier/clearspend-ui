import { createSignal, Match, Switch } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import twLogo from 'app/assets/tw-logo.svg';
import { wait } from '_common/utils/wait';
import { getNoop } from '_common/utils/getNoop';
import { confirmOTP, signup, setPhone, setPassword } from 'onboarding/services/onboarding';
import { saveBusinessProspectID, readBusinessProspectID } from 'onboarding/utils/storeBusinessIDs';
import { IdentifierType } from 'onboarding/types';

import { Box } from './components/Box';
import { StartForm } from './components/StartForm';
import { EmailForm } from './components/EmailForm';
import { PhoneForm } from './components/PhoneForm';
import { VerifyForm } from './components/VerifyForm';
import { PasswordForm } from './components/PasswordForm';

import css from './SignUp.css';

enum Step {
  name,
  email,
  emailConfirm,
  phone,
  phoneConfirm,
  password,
}

// TODO:
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const confirm = async () => wait(2000);

export default function SignUp() {
  const navigate = useNavigate();

  const [step, setStep] = createSignal<Step>(Step.name);
  const next = () => setStep((prev) => prev + 1);

  let onSignup: (email: string) => Promise<unknown> = getNoop(true);

  const onNameUpdate = (firstName: string, lastName: string) => {
    onSignup = async (email: string) => {
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
                description="We have sent a confirmation code to j.smith@company.com"
                // TODO: need API
                onResend={confirm}
                onConfirm={onEmailConfirm}
              />
            </Match>
            <Match when={step() === Step.phone}>
              <PhoneForm onNext={onPhoneUpdate} />
            </Match>
            <Match when={step() === Step.phoneConfirm}>
              <VerifyForm
                header="Verify your phone number"
                description="We have sent a confirmation code to (555) 555-5555"
                // TODO: need API
                onResend={confirm}
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
