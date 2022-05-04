import { createSignal, Match, Switch, Show, onMount } from 'solid-js';
import { useNavigate, useSearchParams } from 'solid-app-router';
import { Text } from 'solid-i18n';

import logo from 'app/assets/Tagline_Lockup_White.svg';
import { useMediaContext } from '_common/api/media/context';
import { formatPhone } from '_common/formatters/phone';
import { confirmOTP, signup, setPhone, setPassword, resendOtp } from 'onboarding/services/onboarding';
import { ProspectStatus, IdentifierType } from 'onboarding/types';
import { login } from 'app/services/auth';
import { BusinessType, BusinessTypeCategory, RelationshipToBusiness } from 'app/types/businesses';
import { Button } from '_common/components/Button';
import type { BusinessProspectData } from 'generated/capital';
import { i18n } from '_common/api/intl';

import { Events, sendAnalyticsEvent, AnalyticsEventType } from '../app/utils/analytics';
import { useMessages } from '../app/containers/Messages/context';

import { AccountSetUpForm } from './components/AccountSetUpForm';
import { PhoneForm } from './components/PhoneForm';
import { VerifyForm } from './components/VerifyForm';
import { PasswordForm } from './components/PasswordForm';
import { useSignup, SignupStore } from './store';
import { BusinessDetailsForm } from './components/BusinessDetailsForm/BusinessDetailsForm';
import { SorryButForm } from './components/SorryButForm/SorryBut';
import { EasyStarted } from './components/EasyStarted';

// eslint-disable-next-line css-modules/no-unused-class
import css from './SignUp.css';
enum Step {
  AccountSetUpStep,
  EmailOtpStep, // TODO: move to after AccountSetUpStep when backend is ready
  BusinessTypeCategoryStep, // now contains BusinessTypeStep and RelationshipToBusinessStep, todo: rename
  PhoneStep,
  PhoneOtpStep,
  PasswordStep,
  SorryButStep,
}

function getInitStep(store: SignupStore): Step {
  const {
    first,
    last,
    businessTypeCategory,
    businessType,
    relationshipToBusiness,
    phone,
    email,
    emailVerified,
    phoneVerified,
  } = store;
  switch (true) {
    case !first || !last || !email:
      return Step.AccountSetUpStep;
    case !emailVerified:
      return Step.EmailOtpStep;
    case !businessTypeCategory || !businessType || !relationshipToBusiness:
      return Step.BusinessTypeCategoryStep;
    case relationshipToBusiness?.includes(RelationshipToBusiness.OTHER) && relationshipToBusiness.length === 1:
      return Step.SorryButStep;
    case !phone:
      return Step.PhoneStep;
    case !phoneVerified:
      return Step.PhoneOtpStep;
    default:
      return Step.PasswordStep;
  }
}

export default function SignUp() {
  const [searchParams] = useSearchParams<{ email?: string }>();
  const navigate = useNavigate();
  const media = useMediaContext();
  const messages = useMessages();

  const {
    store,
    setName,
    setEmail,
    setTel,
    cleanup,
    setBusinessType,
    setBusinessTypeCategory,
    setRelationshipToBusiness,
    setEmailVerified,
    setPhoneVerified,
  } = useSignup();

  const [step, setStep] = createSignal<Step>(getInitStep(store));
  const [emailExists, setEmailExists] = createSignal<boolean>(false);

  const next = (nextStep?: Step) => (nextStep ? setStep(nextStep) : setStep((prev) => prev + 1));

  const onNameUpdate = async (firstName: string, lastName: string, email: string) => {
    setName(firstName, lastName);
    setEmail(email, '');
    sendEmailVerification(firstName, lastName, email);
    sendAnalyticsEvent({ name: Events.SUBMIT_NAME_EMAIL });
    next();
  };

  const accountAlreadyExists = () => {
    messages.success({
      title: i18n.t('You already have an account'),
      message: i18n.t('We have redirected you back to the login page.'),
    });
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

    if (isOwnerOf25 || BusinessType.SOLE_PROPRIETORSHIP === businessType) {
      relationshipToBusiness.push(RelationshipToBusiness.OWNER);
    }

    if (isExecutive) {
      relationshipToBusiness.push(RelationshipToBusiness.EXECUTIVE);
    }

    if (!isOwnerOf25 && !isExecutive) {
      relationshipToBusiness.push(RelationshipToBusiness.OTHER);
    }

    setRelationshipToBusiness(relationshipToBusiness);

    if (isOwnerOf25 || isExecutive || [BusinessTypeCategory.INDIVIDUAL].includes(businessTypeCategory)) {
      await onSignup();
    } else {
      next(Step.SorryButStep);
    }
  };

  const onSignup = async () => {
    const { first, last, email, emailVerified, businessType, relationshipToBusiness } = store;

    if (!first || !last || !email) {
      setStep(Step.AccountSetUpStep);
      return;
    }

    if (emailVerified && !relationshipToBusiness) {
      setStep(Step.BusinessTypeCategoryStep);
      return;
    }

    const resp = await signup({
      email,
      firstName: first,
      lastName: last,
      businessType: businessType as BusinessProspectData['businessType'],
      relationshipOwner: relationshipToBusiness?.includes(RelationshipToBusiness.OWNER),
      relationshipExecutive: relationshipToBusiness?.includes(RelationshipToBusiness.EXECUTIVE),
      tosAndPrivacyPolicyAcceptance: true,
    } as BusinessProspectData & { tosAndPrivacyPolicyAcceptance: boolean });

    setEmail(email, resp.businessProspectId || '');

    sendAnalyticsEvent({ name: `Signup: ${resp.businessProspectStatus}` });

    switch (resp.businessProspectStatus) {
      case ProspectStatus.COMPLETED:
        cleanup();
        accountAlreadyExists();
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

  const sendEmailVerification = async (first: string, last: string, email: string) => {
    if (!first || !last || !email) {
      setStep(Step.AccountSetUpStep);
      return;
    }

    const resp = await signup({
      email,
      firstName: first,
      lastName: last,
      tosAndPrivacyPolicyAcceptance: true,
    } as BusinessProspectData & { tosAndPrivacyPolicyAcceptance: boolean });

    setEmail(email, resp.businessProspectId || '');

    sendAnalyticsEvent({ name: `Email verification sign up: ${resp.businessProspectStatus}` });

    switch (resp.businessProspectStatus) {
      case ProspectStatus.COMPLETED:
        cleanup();
        accountAlreadyExists();
        navigate('/login');
        break;
      case ProspectStatus.EMAIL_VERIFIED:
        setStep(Step.BusinessTypeCategoryStep);
        break;
      case ProspectStatus.MOBILE_VERIFIED:
        setStep(Step.PasswordStep);
        break;
      case ProspectStatus.NEW:
      default:
        setStep(Step.EmailOtpStep);
    }
  };

  const onEmailCodeResend = async () => {
    setEmailExists(false);
    sendAnalyticsEvent({ name: Events.RESEND_EMAIL_OTP });
    await resendOtp({ otpType: 'EMAIL', businessProspectId: store.pid || '' });
    next(Step.EmailOtpStep);
  };

  const onEmailConfirm = async (otp: string) => {
    setEmailExists(false);
    const result = await confirmOTP(store.pid!, { identifierType: IdentifierType.EMAIL, otp });
    if (result.data.emailExist) {
      // Not ideal since it seems there are two different ways a duplicate email error is returned, to be improved.
      setEmailExists(true);
    } else {
      setEmailVerified(true);
      sendAnalyticsEvent({ name: Events.VERIFY_EMAIL });
      next();
    }
  };

  const onPhoneUpdate = async (phone: string) => {
    await setPhone(store.pid!, phone);
    setTel(phone);
    next();
  };

  const onPhoneCodeResend = async () => {
    sendAnalyticsEvent({ name: Events.RESEND_PHONE_OTP });
    await resendOtp({ otpType: 'PHONE', businessProspectId: store.pid || '' });
    next(Step.PhoneOtpStep);
  };

  const onPhoneConfirm = async (otp: string) => {
    await confirmOTP(store.pid!, { identifierType: IdentifierType.PHONE, otp });
    setPhoneVerified(true);
    sendAnalyticsEvent({ name: Events.VERIFY_MOBILE });
    next();
  };

  const onPasswordUpdate = async (password: string) => {
    await setPassword(store.pid!, password);
    await login(store.email!, password);
    cleanup();
    sendAnalyticsEvent({ name: Events.SET_PASSWORD });
    sendAnalyticsEvent({ type: AnalyticsEventType.Identify, name: store.email });
    navigate('/onboarding');
  };

  onMount(() => sendAnalyticsEvent({ name: Events.VIEW_SIGNUP }));

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
              onResend={onEmailCodeResend}
              onConfirm={onEmailConfirm}
              errors={emailExists() ? { code: String(i18n.t('Account already exists with this email.')) } : undefined}
              extraBtn={
                <Button
                  class={css.secondBtn}
                  size={'lg'}
                  view="ghost"
                  onClick={() => {
                    setEmailExists(false);
                    setStep(Step.AccountSetUpStep);
                  }}
                >
                  <Text message="Use different email" />
                </Button>
              }
            />
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
              extraBtn={
                <Button class={css.secondBtn} size={'lg'} view="ghost" onClick={() => setStep(Step.PhoneStep)}>
                  <Text message="Back" />
                </Button>
              }
            />
          </Match>
          <Match when={step() === Step.PasswordStep}>
            <PasswordForm submitText={<Text message="Create Account" />} onPasswordUpdate={onPasswordUpdate} />
          </Match>
        </Switch>
      </div>
      <Show when={media.large}>
        <div class={css.side}>
          <div class={css.sideContent}>
            <EasyStarted />
          </div>
        </div>
      </Show>
    </section>
  );
}
