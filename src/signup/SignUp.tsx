import { createSignal, Match, Switch } from 'solid-js';
import { useNavigate, useSearchParams } from 'solid-app-router';
import { Text } from 'solid-i18n';

import logo from 'app/assets/logo-name.svg';
import { formatPhone } from '_common/formatters/phone';
import { confirmOTP, signup, setPhone, setPassword } from 'onboarding/services/onboarding';
import { ProspectStatus, IdentifierType } from 'onboarding/types';
import { login } from 'app/services/auth';
import { BusinessType, BusinessTypeCategory, RelationshipToBusiness } from 'app/types/businesses';
import type { CreateBusinessProspectRequest } from 'generated/capital';

import { sendAnalyticsEvent } from '../app/utils/analytics';

import { Box } from './components/Box';
import { StartForm } from './components/StartForm';
import { EmailForm } from './components/EmailForm';
import { PhoneForm } from './components/PhoneForm';
import { VerifyForm } from './components/VerifyForm';
import { PasswordForm } from './components/PasswordForm';
import { useSignup, SignupStore } from './store';
import { BusinessTypeCategoryForm } from './components/BusinessTypeCategoryForm/BusinessTypeCategoryForm';
import { BusinessTypeForm } from './components/BusinessTypeForm/BusinessTypeForm';
import { RelationshipToBusinessForm } from './components/RelationshipToBusinessForm/RelationshipToBusinessForm';

import css from './SignUp.css';

enum Step {
  NameStep,
  BusinessTypeCategoryStep,
  BusinessTypeStep,
  RelationshipToBusinessStep,
  EmailStep,
  EmailOtpStep,
  PhoneStep,
  PhoneOtpStep,
  PasswordStep,
}

function getInitStep(store: SignupStore): Step {
  const { first, last, businessTypeCategory, businessType, relationshipToBusiness } = store;
  switch (true) {
    case !first || !last:
      return Step.NameStep;
    case !businessTypeCategory:
      return Step.BusinessTypeCategoryStep;
    case businessTypeCategory === BusinessTypeCategory.COMPANY && !businessType:
      return Step.BusinessTypeStep;
    case !relationshipToBusiness:
      return Step.RelationshipToBusinessStep;
    default:
      return Step.EmailStep;
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
  const back = (backStep?: Step) => (backStep ? setStep(backStep) : setStep((prev) => prev - 1));

  const onNameUpdate = (firstName: string, lastName: string) => {
    setName(firstName, lastName);
    next();
  };

  const onBusinessTypeCategoryUpdate = (businessTypeCategory: BusinessTypeCategory) => {
    setBusinessTypeCategory(businessTypeCategory);
    next(businessTypeCategory === BusinessTypeCategory.COMPANY ? undefined : Step.RelationshipToBusinessStep);
  };

  const onBusinessTypeUpdate = (businessType: BusinessType) => {
    setBusinessType(businessType);
    next();
  };

  const onRelationshipToBusinessUpdate = (relationshipToBusiness: Readonly<RelationshipToBusiness[]>) => {
    setRelationshipToBusiness(relationshipToBusiness);
    next();
  };

  const onSignup = async (email: string) => {
    const { first, last, businessType, relationshipToBusiness } = store;

    if (!first || !last) {
      setStep(Step.NameStep);
      return;
    }

    const resp = await signup({
      email,
      firstName: first,
      lastName: last,
      businessType: businessType as CreateBusinessProspectRequest['businessType'],
      relationshipOwner: relationshipToBusiness?.includes(RelationshipToBusiness.OWNER),
      relationshipRepresentative: true, // TODO: check - this should always be true or not required by API?
      relationshipDirector: relationshipToBusiness?.includes(RelationshipToBusiness.DIRECTOR),
      relationshipExecutive: relationshipToBusiness?.includes(RelationshipToBusiness.EXECUTIVE),
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
        <Box>
          <Switch>
            <Match when={step() === Step.NameStep}>
              <StartForm onNext={onNameUpdate} />
            </Match>
            <Match when={step() === Step.BusinessTypeCategoryStep}>
              <BusinessTypeCategoryForm onNext={onBusinessTypeCategoryUpdate} />
            </Match>
            <Match when={step() === Step.BusinessTypeStep}>
              <BusinessTypeForm onNext={onBusinessTypeUpdate} onBack={() => back()} />
            </Match>
            <Match when={step() === Step.RelationshipToBusinessStep}>
              <RelationshipToBusinessForm
                onNext={onRelationshipToBusinessUpdate}
                onBack={() =>
                  back(
                    store.businessTypeCategory === BusinessTypeCategory.COMPANY
                      ? undefined
                      : Step.BusinessTypeCategoryStep,
                  )
                }
              />
            </Match>
            <Match when={step() === Step.EmailStep}>
              <EmailForm initialEmailValue={searchParams.email} onNext={onSignup} />
            </Match>
            <Match when={step() === Step.EmailOtpStep}>
              <VerifyForm
                header="Verify your email"
                description={<Text message="We have sent a confirmation code to <b>{email}</b>" email={store.email!} />}
                onResend={onEmailCodeResend}
                onConfirm={onEmailConfirm}
              />
            </Match>
            <Match when={step() === Step.PhoneStep}>
              <PhoneForm onNext={onPhoneUpdate} />
            </Match>
            <Match when={step() === Step.PhoneOtpStep}>
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
            <Match when={step() === Step.PasswordStep}>
              <PasswordForm onCreateAccount={onPasswordUpdate} />
            </Match>
          </Switch>
        </Box>
      </div>
    </section>
  );
}
