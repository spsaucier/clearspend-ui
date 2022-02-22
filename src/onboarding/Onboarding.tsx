import { createSignal, batch, Show, Switch, Match } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';
import { omit } from 'solid-create-form/lib/utils';

import { Icon } from '_common/components/Icon';
import { storage } from '_common/api/storage';
import { useMediaContext } from '_common/api/media/context';
import { MainLayout } from 'app/components/MainLayout';
import { Page } from 'app/components/Page';
import { Section } from 'app/components/Section';
import { useOnboardingBusiness } from 'app/containers/Main/context';
import { useMessages } from 'app/containers/Messages/context';
import { BusinessType, OnboardingStep } from 'app/types/businesses';
import { formatName } from 'employees/utils/formatName';
import { uploadForApplicationReview } from 'app/services/review';
import logoLight from 'app/assets/logo-light.svg';
import type {
  BankAccount,
  Business,
  ConvertBusinessProspectRequest,
  CreateOrUpdateBusinessOwnerRequest,
} from 'generated/capital';
import { wrapAction } from '_common/utils/wrapAction';
import { logout } from 'app/services/auth';
import { AppEvent } from 'app/types/common';
import { events } from '_common/api/events';
import { Button } from '_common/components/Button';

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
import { linkBankAccounts, getBankAccounts, bankTransaction, registerBankAccount } from './services/accounts';
import { Review, SoftFail } from './components/SoftFail';
import type { KycDocuments, RequiredDocument } from './components/SoftFail/types';
import { ONBOARDING_LEADERS_KEY } from './components/TeamForm/TeamForm';

import css from './Onboarding.css';

const ONBOARDING_BANK_ACCOUNTS_STORAGE_KEY = 'ONBOARDING_BANK_ACCOUNTS_STORAGE_KEY';

export default function Onboarding() {
  const media = useMediaContext();
  const messages = useMessages();
  const navigate = useNavigate();

  const { business, signupUser, refetch, mutate } = useOnboardingBusiness();
  const [businessProspectInfo, setBusinessProspectInfo] = createSignal<{ businessType: BusinessType }>();
  const [teamTitle, setTeamTitle] = createSignal('');

  const fillBusinessProspectInfo = async () => {
    const result = await getBusinessProspectInfo(signupUser().userId!);
    if (result.data) {
      setBusinessProspectInfo(result.data as { businessType: BusinessType });
    }
  };

  fillBusinessProspectInfo();

  const [step, setStep] = createSignal<OnboardingStep | undefined>(business()?.onboardingStep as OnboardingStep);
  const [accounts, setAccounts] = createSignal<readonly Readonly<Required<BankAccount>>[]>(
    storage.get<readonly Readonly<Required<BankAccount>>[]>(ONBOARDING_BANK_ACCOUNTS_STORAGE_KEY, []),
  );

  const [kybRequiredDocuments, setKYBRequiredDocuments] = createSignal<readonly Readonly<RequiredDocument>[]>();
  const [kycRequiredDocuments, setKYCRequiredDocuments] = createSignal<readonly Readonly<KycDocuments>[]>();

  if (business()?.onboardingStep === OnboardingStep.TRANSFER_MONEY && !accounts().length) {
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
    mutate([{ ...signupUser(), userId: resp.businessOwnerId! }, resp.business as Business, null]);
    setStep(OnboardingStep.BUSINESS_OWNERS);
  };

  const getMinutesRemaining = (currentStep?: OnboardingStep) => {
    switch (currentStep) {
      case OnboardingStep.TRANSFER_MONEY:
        return `2`;
      case OnboardingStep.LINK_ACCOUNT:
        return `4`;
      case OnboardingStep.REVIEW:
        return `6`;
      case OnboardingStep.BUSINESS_OWNERS:
        return `10`;
      default:
      case OnboardingStep.BUSINESS:
        return `12`;
    }
  };

  const onUpdateKYC = async (data: Readonly<CreateOrUpdateBusinessOwnerRequest[]>) => {
    try {
      const [currUser, ...users] = data;
      await setBusinessOwners([
        {
          firstName: '',
          lastName: '',
          dateOfBirth: '',
          taxIdentificationNumber: '',
          email: '',
          ...currUser,
          id: signupUser().userId, // ID only for the already existing one (current from login)
          isOnboarding: true,
        },
        ...users.map((user) => omit(user, 'id')),
      ]);
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

  const onGotVerifyToken = async (token: string, accountName?: string) => {
    const bankAccounts = await linkBankAccounts(token);
    batch(async () => {
      const matchedAccounts = accountName
        ? bankAccounts.filter((account) => account.name === accountName && account.businessBankAccountId)
        : bankAccounts.filter((account) => account.businessBankAccountId);
      setAccounts(matchedAccounts);
      storage.set(ONBOARDING_BANK_ACCOUNTS_STORAGE_KEY, matchedAccounts);
      await Promise.all(matchedAccounts.map((account) => registerBankAccount(account.businessBankAccountId)));
      setStep(OnboardingStep.TRANSFER_MONEY);
    });
  };

  const onDeposit = async (accountId: string, amount: number) => {
    await bankTransaction('DEPOSIT', accountId, amount);
    await refetch();
    storage.set(ONBOARDING_BANK_ACCOUNTS_STORAGE_KEY, []);
    storage.set(ONBOARDING_LEADERS_KEY, []);
    navigate('/');
  };

  const checkReviewStatus = async () => {
    await refetch();
    if (business()?.onboardingStep !== 'REVIEW') {
      setStep(business()?.onboardingStep as OnboardingStep);
    }
  };

  const [logoutLoading, logoutAction] = wrapAction(() => logout().then(() => events.emit(AppEvent.Logout)));

  return (
    <MainLayout
      darkSide
      side={
        <div class={css.sidebar}>
          <header class={css.header}>
            <img src={logoLight} alt="Company logo" width={120} height={34} />
          </header>
          <Show when={media.medium}>
            <div class={css.estimated}>
              <Icon size={'md'} name={'clock'} />
              Estimated time remaing: {getMinutesRemaining(step())} minutes
            </div>
            <div class={css.steps}>
              <SideSteps step={step()} />
            </div>
          </Show>
          <footer class={css.footer}>
            <div>
              <Icon name="user" />
              <span class={css.user}>{formatName(signupUser())}</span>
            </div>
            <Button
              size="sm"
              loading={logoutLoading()}
              onClick={logoutAction}
              type="default"
              view="ghost"
              class={css.headerFont}
            >
              <Text message="Sign out" />
            </Button>
          </footer>
        </div>
      }
    >
      <div class={css.sand}>
        <Switch>
          <Match when={!step() && businessProspectInfo()?.businessType}>
            <Page title="First, tell us a little bit about your business">
              <BusinessForm onNext={onUpdateKYB} businessType={businessProspectInfo()?.businessType!} />
            </Page>
          </Match>
          <Match when={step() === OnboardingStep.BUSINESS_OWNERS}>
            <Page title={teamTitle}>
              <TeamForm business={business()} setTitle={setTeamTitle} onNext={onUpdateKYC} signupUser={signupUser()} />
            </Page>
          </Match>
          <Match when={step() === OnboardingStep.SOFT_FAIL}>
            <Page title="Just a few more things...">
              <SoftFail
                kybRequiredDocuments={kybRequiredDocuments()}
                kycRequiredDocuments={kycRequiredDocuments()}
                onNext={onSoftFail}
              />
            </Page>
          </Match>
          <Match when={step() === OnboardingStep.REVIEW}>
            <Review ownerEmail={signupUser().email || ''} refetch={checkReviewStatus} />
          </Match>
          <Match when={step() === OnboardingStep.LINK_ACCOUNT}>
            <Page title="Show us the money! Well...kind of. It's time to link your bank account 💰">
              <Section
                title="Connect your bank"
                description="Connecting your bank account brings you one step closer to becoming an expense management superstar."
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
      </div>
    </MainLayout>
  );
}
