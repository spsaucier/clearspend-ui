import { createSignal, Match, Switch } from 'solid-js';
import { useNavigate, useSearchParams } from 'solid-app-router';
import { Text } from 'solid-i18n';

import logo from 'app/assets/logo-light.svg';
import { formatPhone } from '_common/formatters/phone';
import { confirmOTP, signup, setPhone, setPassword } from 'onboarding/services/onboarding';
import { ProspectStatus, IdentifierType } from 'onboarding/types';
import { login } from 'app/services/auth';
import { BusinessType, BusinessTypeCategory, RelationshipToBusiness } from 'app/types/businesses';
import type { CreateBusinessProspectRequest } from 'generated/capital';
import { Button } from '_common/components/Button';

import { sendAnalyticsEvent } from '../app/utils/analytics';

import { AccountSetUpForm } from './components/AccountSetUpForm';
import { PhoneForm } from './components/PhoneForm';
import { VerifyForm } from './components/VerifyForm';
import { PasswordForm } from './components/PasswordForm';
import { useSignup, SignupStore } from './store';
import { BusinessDetailsForm } from './components/BusinessDetailsForm/BusinessDetailsForm';
import { SorryButForm } from './components/SorryButForm/SorryBut';

// eslint-disable-next-line css-modules/no-unused-class
import css from './SignUp.css';

enum Step {
  AccountSetUpStep,
  BusinessTypeCategoryStep, // now contains BusinessTypeStep and RelationshipToBusinessStep, todo: rename
  SorryButStep,
  EmailOtpStep, // todo: move to after AccountSetUpStep when backend is ready
  PhoneStep,
  PhoneOtpStep,
  PasswordStep,
}

function getInitStep(store: SignupStore): Step {
  const { first, last, businessTypeCategory, businessType, relationshipToBusiness, phone, email } = store;
  switch (true) {
    case !first || !last || !email:
      return Step.AccountSetUpStep;
    case !businessTypeCategory || !businessType || !relationshipToBusiness:
      return Step.BusinessTypeCategoryStep;
    case relationshipToBusiness?.includes(RelationshipToBusiness.OTHER):
      return Step.SorryButStep;
    case !phone:
      return Step.PhoneStep;
    default:
      return Step.AccountSetUpStep;
  }
}

export default function SignUp() {
  const [searchParams] = useSearchParams<{ email?: string }>();
  const navigate = useNavigate();

  const {
    store,
    setName,
    setEmail,
    setTel,
    cleanup,
    setBusinessType,
    setBusinessTypeCategory,
    setRelationshipToBusiness,
  } = useSignup();

  const [step, setStep] = createSignal<Step>(getInitStep(store));

  const next = (nextStep?: Step) => (nextStep ? setStep(nextStep) : setStep((prev) => prev + 1));
  // const back = (backStep?: Step) => (backStep ? setStep(backStep) : setStep((prev) => prev - 1));

  const onNameUpdate = async (firstName: string, lastName: string, email: string) => {
    setName(firstName, lastName);
    setEmail(email, '');
    next();
  };

  const onBusinessTypeCategoryUpdate = async (
    businessTypeCategory: BusinessTypeCategory,
    businessType: BusinessType,
    isOwnerOf25?: boolean,
    isExecutive?: boolean,
  ) => {
    setBusinessTypeCategory(businessTypeCategory);
    setBusinessType(businessType);
    const relationshipToBusiness = [];

    if (isOwnerOf25) {
      relationshipToBusiness.push(RelationshipToBusiness.OWNER);
    } else if (isExecutive) {
      relationshipToBusiness.push(RelationshipToBusiness.EXECUTIVE);
    } else {
      relationshipToBusiness.push(RelationshipToBusiness.OTHER);
    }

    setRelationshipToBusiness(relationshipToBusiness);

    if (
      isOwnerOf25 ||
      isExecutive ||
      [BusinessTypeCategory.INDIVIDUAL, BusinessTypeCategory.NONPROFIT].includes(businessTypeCategory)
    ) {
      await onSignup();
    } else {
      next(Step.SorryButStep);
    }
  };

  const onSignup = async () => {
    const { first, last, businessType, email, relationshipToBusiness } = store;

    if (!first || !last || !email) {
      setStep(Step.AccountSetUpStep);
      return;
    }

    if (!relationshipToBusiness) {
      setStep(Step.BusinessTypeCategoryStep);
      return;
    }

    const resp = await signup({
      email,
      firstName: first,
      lastName: last,
      businessType: businessType as CreateBusinessProspectRequest['businessType'],
      relationshipOwner: relationshipToBusiness.includes(RelationshipToBusiness.OWNER),
      relationshipRepresentative: true,
      relationshipDirector: relationshipToBusiness.includes(RelationshipToBusiness.DIRECTOR),
      relationshipExecutive: relationshipToBusiness.includes(RelationshipToBusiness.EXECUTIVE),
    });

    setEmail(email, resp.businessProspectId || '');

    sendAnalyticsEvent({ name: `Signup: ${resp.businessProspectStatus}` });

    switch (resp.businessProspectStatus) {
      case ProspectStatus.COMPLETED:
        cleanup();
        navigate('/login');
        break;
      case ProspectStatus.EMAIL_VERIFIED:
        setStep(Step.PhoneStep);
        break;
      case ProspectStatus.MOBILE_VERIFIED:
        setStep(Step.PasswordStep);
        break;
      case ProspectStatus.NEW:
      default:
        setStep(Step.EmailOtpStep);
    }
  };

  const onEmailCodeResend = async () => onSignup();

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
    await login(store.email!, password);
    cleanup();
    navigate('/onboarding');
  };

  return (
    <section class={css.root}>
      <header class={css.header}>
        <img src={logo} alt="Company logo" width={120} height={34} />
      </header>
      <div class={css.content}>
        <Switch>
          <Match when={step() === Step.AccountSetUpStep}>
            <AccountSetUpForm initialEmailValue={searchParams.email} onNext={onNameUpdate} />
          </Match>
          <Match when={step() === Step.BusinessTypeCategoryStep}>
            <BusinessDetailsForm onNext={onBusinessTypeCategoryUpdate} />
          </Match>
          <Match when={step() === Step.SorryButStep}>
            <SorryButForm
              onNext={() => {
                // tbd
              }}
            />
          </Match>
          <Match when={step() === Step.EmailOtpStep}>
            <VerifyForm
              header={
                <Text
                  message="👋 Hey {first}, it's nice to meet you!  Did you get your six digit confirmation code in your email?"
                  first={store.first!}
                />
              }
              description={
                <Text
                  message={`We sent it to <b>{email}</b> - if you don't get it within {X} time, please click  "I didn't receive the code" below and we'll try again, and again until one of us needs a break ☕️`}
                  email={store.email!}
                />
              }
              onResend={onEmailCodeResend}
              onConfirm={onEmailConfirm}
              extraBtn={
                <Button class={css.secondBtn} size={'lg'} view="ghost" onClick={() => setStep(Step.AccountSetUpStep)}>
                  Back
                </Button>
              }
            />
          </Match>
          <Match when={step() === Step.PhoneStep}>
            <PhoneForm onNext={onPhoneUpdate} />
          </Match>
          <Match when={step() === Step.PhoneOtpStep}>
            <VerifyForm
              header="Verify your phone number"
              description={
                <Text message="We have sent a confirmation code to <b>{phone}</b>" phone={formatPhone(store.phone!)} />
              }
              onResend={onPhoneCodeResend}
              onConfirm={onPhoneConfirm}
            />
          </Match>
          <Match when={step() === Step.PasswordStep}>
            <PasswordForm onCreateAccount={onPasswordUpdate} />
          </Match>
        </Switch>
      </div>
    </section>
  );
}
