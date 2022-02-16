import { useContext, createSignal, batch, Show, Switch, Match } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { Icon } from '_common/components/Icon';
import { useMediaContext } from '_common/api/media/context';
import { MainLayout } from 'app/components/MainLayout';
import { Page } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { BusinessContext } from 'app/containers/Main/context';
import { useMessages } from 'app/containers/Messages/context';
import { BusinessType, OnboardingStep } from 'app/types/businesses';
import { formatName } from 'employees/utils/formatName';
import { uploadForApplicationReview } from 'app/services/review';
import logo from 'app/assets/logo-name.svg';
import type {
  BankAccount,
  Business,
  ConvertBusinessProspectRequest,
  CreateOrUpdateBusinessOwnerRequest,
} from 'generated/capital';

import { SideSteps } from './components/SideSteps';
import { BusinessForm } from './components/BusinessForm';
import { TeamForm } from './components/TeamForm';
import { LinkAccount } from './containers/LinkAccount';
import { TransferMoney } from './components/TransferMoney';
import {
  getBusinessProspectInfo,
  getApplicationReviewRequirements,
  setBusinessInfo,
  setBusinessOwners,
} from './services/onboarding';
import { linkBankAccounts, getBankAccounts, onboardingDeposit } from './services/accounts';
import { Review, SoftFail } from './components/SoftFail';
import type { KycDocuments, RequiredDocument } from './components/SoftFail/types';

import css from './Onboarding.css';

export default function Onboarding() {
  const media = useMediaContext();
  const messages = useMessages();
  const navigate = useNavigate();

  const { business, signupUser, refetch, mutate } = useContext(BusinessContext)!;
  const [businessProspectInfo, setBusinessProspectInfo] = createSignal<{ businessType: BusinessType }>();

  const fillBusinessProspectInfo = async () => {
    const result = await getBusinessProspectInfo(signupUser().userId!);
    if (result.data) {
      setBusinessProspectInfo(result.data as { businessType: BusinessType });
    }
  };

  fillBusinessProspectInfo();

  const [step, setStep] = createSignal<OnboardingStep | undefined>(business()?.onboardingStep as OnboardingStep);
  const [accounts, setAccounts] = createSignal<readonly Readonly<Required<BankAccount>>[]>([]);

  const [kybRequiredDocuments, setKYBRequiredDocuments] = createSignal<readonly Readonly<RequiredDocument>[]>();
  const [kycRequiredDocuments, setKYCRequiredDocuments] = createSignal<readonly Readonly<KycDocuments>[]>();

  if (business()?.onboardingStep === OnboardingStep.TRANSFER_MONEY) {
    getBankAccounts()
      .then((data) => setAccounts(data))
      .catch(() => messages.error({ title: 'Something went wrong' }));
  }

  if (step() === OnboardingStep.SOFT_FAIL || step() === OnboardingStep.BUSINESS) {
    getApplicationReviewRequirements()
      .then((data) => {
        setKYBRequiredDocuments(data.kybRequiredDocuments);
        setKYCRequiredDocuments(data.kycRequiredDocuments);
        if (
          kybRequiredDocuments() &&
          kybRequiredDocuments()!.length === 0 &&
          kycRequiredDocuments() &&
          kycRequiredDocuments()!.length === 0
        ) {
          setStep(OnboardingStep.REVIEW);
        }
      })
      .catch(() => messages.error({ title: 'Something went wrong' }));
  }

  const onUpdateKYB = async (data: Readonly<ConvertBusinessProspectRequest>) => {
    const resp = await setBusinessInfo(signupUser().userId!, data);
    mutate([{ ...signupUser(), userId: resp.businessOwnerId! }, resp.business as Business]);
    setStep(OnboardingStep.BUSINESS_OWNERS);
  };

  const onUpdateKYC = async (data: Readonly<CreateOrUpdateBusinessOwnerRequest>) => {
    try {
      await setBusinessOwners([{ id: signupUser().userId!, ...data, isOnboarding: true }]); // ID only for the already existing one (current from login)
      await refetch();
      const reviewRequirements = await getApplicationReviewRequirements();

      setKYBRequiredDocuments(reviewRequirements.kybRequiredDocuments);
      setKYCRequiredDocuments(reviewRequirements.kycRequiredDocuments);

      if (reviewRequirements.kycRequiredDocuments.length > 0 || reviewRequirements.kybRequiredDocuments.length > 0) {
        setStep(OnboardingStep.SOFT_FAIL);
      } else {
        setStep(OnboardingStep.LINK_ACCOUNT);
      }
    } catch (err: unknown) {
      messages.error({ title: 'Something went wrong' });
      setStep(OnboardingStep.BUSINESS_OWNERS);
    }
  };

  const onSoftFail = async (data: Readonly<{}>) => {
    await uploadForApplicationReview(data);
    setStep(OnboardingStep.REVIEW);
  };

  const onGotVerifyToken = async (token: string) => {
    const bankAccounts = await linkBankAccounts(token);
    batch(() => {
      setAccounts(bankAccounts);
      setStep(OnboardingStep.TRANSFER_MONEY);
    });
  };

  const onDeposit = async (accountId: string, amount: number) => {
    await onboardingDeposit(accountId, amount);
    await refetch();
    navigate('/');
  };

  return (
    <MainLayout
      side={
        <div class={css.sidebar}>
          <header class={css.header}>
            <img src={logo} alt="Company logo" width={120} height={34} />
          </header>
          <Show when={media.medium}>
            <div class={css.steps}>
              <SideSteps step={step()} />
            </div>
          </Show>
          <footer class={css.footer}>
            <Icon name="user" />
            <span class={css.user}>{formatName(signupUser())}</span>
          </footer>
        </div>
      }
    >
      <Switch>
        <Match when={!step() && businessProspectInfo()?.businessType}>
          <Page title="Tell us about your business">
            <BusinessForm onNext={onUpdateKYB} businessType={businessProspectInfo()?.businessType!} />
          </Page>
        </Match>
        <Match when={step() === OnboardingStep.BUSINESS_OWNERS}>
          <Page title="Tell us about your team">
            <TeamForm onNext={onUpdateKYC} signupUser={signupUser()} />
          </Page>
        </Match>
        <Match when={step() === OnboardingStep.SOFT_FAIL}>
          <Page title="Additional info required">
            <SoftFail
              kybRequiredDocuments={kybRequiredDocuments()}
              kycRequiredDocuments={kycRequiredDocuments()}
              onNext={onSoftFail}
            />
          </Page>
        </Match>
        <Match when={step() === OnboardingStep.REVIEW}>
          <Page title="Thank you">
            <Review ownerEmail={signupUser().email || ''} />
          </Page>
        </Match>
        <Match when={step() === OnboardingStep.LINK_ACCOUNT}>
          <Page title="Link your bank account">
            <Section
              title="Connect your account"
              description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tempor."
              contentClass={css.verifySectionContent}
            >
              <LinkAccount verifyOnLoad onSuccess={onGotVerifyToken} />
            </Section>
          </Page>
        </Match>
        <Match when={step() === OnboardingStep.TRANSFER_MONEY}>
          <Page title="Transfer money">
            <Show when={accounts()}>
              <TransferMoney accounts={accounts()} onDeposit={onDeposit} />
            </Show>
          </Page>
        </Match>
      </Switch>
    </MainLayout>
  );
}
