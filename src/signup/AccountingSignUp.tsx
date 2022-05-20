import { Text } from 'solid-i18n';
import { createSignal, Match, Show, Switch } from 'solid-js';
import { useSearchParams } from 'solid-app-router';

import { Button } from '_common/components/Button';
import { useMediaContext } from '_common/api/media/context';
import { formatPhone } from '_common/formatters/phone';
import logo from 'app/assets/Tagline_Lockup_White.svg';

import { VerifyForm } from './components/VerifyForm';
import { AccountSetUpForm } from './components/AccountSetUpForm';
import { AccountingPartnershipEasyStarted } from './components/EasyStarted';
import { PasswordForm } from './components/PasswordForm';
import { PhoneForm } from './components/PhoneForm';
import { SorryButForm } from './components/SorryButForm/SorryBut';
import { BusinessDetailsForm } from './components/BusinessDetailsForm/BusinessDetailsForm';
// import { i18n } from '_common/api/intl';

import { Step, useSignup } from './store';

import css from './SignUp.css';

export default function AccountingSignUp() {
  const [searchParams] = useSearchParams<{ email?: string }>();
  const media = useMediaContext();

  const {
    store,
    setName,
    setEmail,
    // setTel,
    // cleanup,
    // setBusinessType,
    // setBusinessTypeCategory,
    // setRelationshipToBusiness,
    // setEmailVerified,
    // setPhoneVerified,
  } = useSignup();

  const next = (nextStep?: Step) => (nextStep ? setStep(nextStep) : setStep((prev) => prev + 1));

  const onNameUpdate = async (firstName: string, lastName: string, email: string) => {
    setName(firstName, lastName);
    setEmail(email, '');
    // sendEmailVerification(firstName, lastName, email);
    // sendAnalyticsEvent({ name: Events.SUBMIT_NAME_EMAIL });
    next();
  };

  const [step, setStep] = createSignal(Step.AccountSetUpStep);
  return (
    <section class={css.root}>
      <header class={css.header}>
        <img src={logo} alt="Company logo" width={189} height={70} />
      </header>
      <div class={css.content}>
        <Switch>
          <Match when={step() === Step.AccountSetUpStep}>
            <AccountSetUpForm initialEmailValue={searchParams.email} onNext={onNameUpdate} />
          </Match>
          <Match when={step() === Step.EmailOtpStep}>
            <VerifyForm
              header={<Text message="👋 Hey {first}, it's nice to meet you!" first={store.first!} />}
              description={
                <Text
                  message={`Did you get your six digit confirmation code in your email? We sent it to <b>{email}</b>`}
                  email={store.email!}
                />
              }
              extraDescription={
                <div class={css.extraDescription}>
                  <Text
                    message={
                      "It could end up in your spam folder, but if you don't get it within 5 minutes, " +
                      'please click  "Resend code" below and we\'ll try again, ' +
                      'and again until one of us needs a break ☕️'
                    }
                  />
                </div>
              }
              onResend={async () => null}
              onConfirm={async () => next()}
              // errors={emailExists() ? { code: String(i18n.t('Account already exists with this email.')) } : undefined}
              extraBtn={
                <Button
                  class={css.secondBtn}
                  size={'lg'}
                  view="ghost"
                  onClick={() => {
                    // setEmailExists(false);
                    setStep(Step.AccountSetUpStep);
                  }}
                >
                  <Text message="Use different email" />
                </Button>
              }
            />
          </Match>
          <Match when={step() === Step.BusinessTypeCategoryStep}>
            <BusinessDetailsForm onNext={async () => next()} />
          </Match>
          <Match when={step() === Step.SorryButStep}>
            <SorryButForm
              onNext={() => {
                // tbd
              }}
            />
          </Match>
          <Match when={step() === Step.PhoneStep}>
            <PhoneForm onNext={async () => next()} />
          </Match>
          <Match when={step() === Step.PhoneOtpStep}>
            <VerifyForm
              header="Verify your phone number"
              description={
                <Text message="We have sent a confirmation code to <b>{phone}</b>" phone={formatPhone(store.phone!)} />
              }
              // onResend={onPhoneCodeResend}
              onConfirm={async () => next()}
              extraBtn={
                <Button class={css.secondBtn} size={'lg'} view="ghost" onClick={() => setStep(Step.PhoneStep)}>
                  <Text message="Back" />
                </Button>
              }
            />
          </Match>
          <Match when={step() === Step.PasswordStep}>
            <PasswordForm submitText={<Text message="Create Account" />} onPasswordUpdate={async () => next()} />
          </Match>
        </Switch>
      </div>
      <Show when={media.large}>
        <div class={css.side}>
          <div class={css.sideContent}>
            <AccountingPartnershipEasyStarted />
          </div>
        </div>
      </Show>
    </section>
  );
}
