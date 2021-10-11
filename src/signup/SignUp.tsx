// TODO: update code and remove comment after integrate with API
/* eslint-disable no-console, @typescript-eslint/no-magic-numbers */

import { Switch, Match, createSignal } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import twLogo from 'app/assets/tw-logo.svg';
import { wait } from '_common/utils/wait';

import { Box } from './components/Box';
import { StartForm } from './components/StartForm';
import { EmailForm } from './components/EmailForm';
import { PhoneForm } from './components/PhoneForm';
import { VerifyForm } from './components/VerifyForm';
import { PasswordForm } from './components/PasswordForm';

import css from './SignUp.css';

const confirm = async () => wait(2000);

export default function SignUp() {
  const navigate = useNavigate();

  const [step, setStep] = createSignal(0);
  const next = () => setStep((prev) => prev + 1);

  const create = async () => {
    await confirm();
    navigate('/onboarding');
  };

  return (
    <section class={css.root}>
      <header class={css.header}>
        <img src={twLogo} alt="Company logo" />
      </header>
      <div class={css.content}>
        <Box>
          <Switch>
            <Match when={step() === 0}>
              <StartForm onNext={next} />
            </Match>
            <Match when={step() === 1}>
              <EmailForm onNext={next} />
            </Match>
            <Match when={step() === 2}>
              <VerifyForm
                header="Verify your email"
                description="We have sent a confirmation code to j.smith@company.com"
                onResend={confirm}
                onConfirm={confirm}
                onNext={next}
              />
            </Match>
            <Match when={step() === 3}>
              <PhoneForm onNext={next} />
            </Match>
            <Match when={step() === 4}>
              <VerifyForm
                header="Verify your phone number"
                description="We have sent a confirmation code to (555) 555-5555"
                onResend={confirm}
                onConfirm={confirm}
                onNext={next}
              />
            </Match>
            <Match when={step() === 5}>
              <PasswordForm onCreateAccount={create} />
            </Match>
          </Switch>
        </Box>
      </div>
    </section>
  );
}
