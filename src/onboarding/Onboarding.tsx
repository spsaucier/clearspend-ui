import { createSignal, batch, Show, Switch, Match } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { Icon } from '_common/components/Icon';
import { storage } from '_common/api/storage';
import { useMediaContext } from '_common/api/media/context';
import { MainLayout } from 'app/components/MainLayout';
import { Page } from 'app/components/Page';
import { useOnboardingBusiness } from 'app/containers/Main/context';
import { useMessages } from 'app/containers/Messages/context';
import { OnboardingStep } from 'app/types/businesses';
import { formatName } from 'employees/utils/formatName';
import { uploadForApplicationReview } from 'app/services/review';
import logoLight from 'app/assets/logo-light.svg';
import type { BankAccount, Business, ConvertBusinessProspectRequest, UpdateBusiness } from 'generated/capital';
import { wrapAction } from '_common/utils/wrapAction';
import { logout } from 'app/services/auth';
import { AppEvent } from 'app/types/common';
import { events } from '_common/api/events';
import { Button } from '_common/components/Button';
import { completeOnboarding } from 'allocations/services';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';

import { SideSteps } from './components/SideSteps';
import { BusinessForm } from './components/BusinessForm';
import { TeamForm } from './components/TeamForm';
import { TransferMoney } from './components/TransferMoney';
import {
  getBusinessProspectInfo,
  getApplicationReviewRequirements,
  setBusinessInfo,
  triggerBusinessOwners,
  updateBusinessInfo,
} from './services/onboarding';
import { linkBankAccounts, getBankAccounts, bankTransaction, registerBankAccount } from './services/accounts';
import { Review, SoftFail } from './components/SoftFail';
import type { KycDocuments, RequiredDocument } from './components/SoftFail/types';
import { ONBOARDING_LEADERS_KEY } from './components/TeamForm/TeamForm';
import LinkAccountStep from './containers/LinkAccount/LinkAccountStep';
import type { BusinessWithBusinessName } from './components/BusinessForm/BusinessForm';

import css from './Onboarding.css';

const ONBOARDING_BANK_ACCOUNTS_STORAGE_KEY = 'ONBOARDING_BANK_ACCOUNTS_STORAGE_KEY';

export default function Onboarding() {
  const media = useMediaContext();
  const messages = useMessages();
  const navigate = useNavigate();

  const { business, currentUser, refetch, mutate } = useOnboardingBusiness();
  const [businessProspectInfo, setBusinessProspectInfo] = createSignal<{ businessType: Business['businessType'] }>();
  const [teamTitle, setTeamTitle] = createSignal('');

  const [logoutLoading, logoutAction] = wrapAction(() => logout().then(() => events.emit(AppEvent.Logout)));

  const fillBusinessProspectInfo = async () => {
    const result = await getBusinessProspectInfo(currentUser().userId!);
    if (result.data) {
      setBusinessProspectInfo(result.data as { businessType: Business['businessType'] });
    }
  };

  fillBusinessProspectInfo();

  const [step, setStep] = createSignal<OnboardingStep | undefined>(business()?.onboardingStep as OnboardingStep);
  const [accounts, setAccounts] = createSignal<readonly Readonly<Required<BankAccount>>[]>(
    storage.get<readonly Readonly<Required<BankAccount>>[]>(ONBOARDING_BANK_ACCOUNTS_STORAGE_KEY, []),
  );

  const [kybRequiredDocuments, setKYBRequiredDocuments] = createSignal<readonly Readonly<RequiredDocument>[]>();
  const [kycRequiredDocuments, setKYCRequiredDocuments] = createSignal<readonly Readonly<KycDocuments>[]>();

  const [kybRequiredFields, setKybRequiredFields] = createSignal<readonly Readonly<string>[]>();
  const [kycRequiredFields, setKycRequiredFields] = createSignal<Readonly<{ [key: string]: string[] }>>({});

  if (business()?.onboardingStep === OnboardingStep.TRANSFER_MONEY && !accounts().length) {
    getBankAccounts()
      .then((data) => setAccounts(data))
      .catch(() => messages.error({ title: 'Something went wrong' }));
  }

  if (
    step() === OnboardingStep.SOFT_FAIL ||
    step() === OnboardingStep.BUSINESS ||
    step() === OnboardingStep.BUSINESS_OWNERS
  ) {
    getApplicationReviewRequirements()
      .then((data) => {
        setKYBRequiredDocuments(data.kybRequiredDocuments);
        setKYCRequiredDocuments(data.kycRequiredDocuments);
        setKybRequiredFields(data.kybRequiredFields);
        setKycRequiredFields(data.kycRequiredFields);
        if (data.kybRequiredFields.length > 0) {
          setStep(OnboardingStep.BUSINESS);
        } else if (Object.keys(data.kycRequiredFields).length > 0) {
          setStep(OnboardingStep.BUSINESS_OWNERS);
        } else if (data.kybRequiredDocuments.length === 0 && data.kycRequiredDocuments.length === 0) {
          setStep(OnboardingStep.REVIEW);
        }
      })
      .catch(() => messages.error({ title: 'Something went wrong' }));
  }

  const onUpdateKYB = async (data: Readonly<ConvertBusinessProspectRequest | UpdateBusiness>) => {
    if (business()) {
      // update
      await updateBusinessInfo(data as UpdateBusiness);
      setKYBRequiredDocuments([]);
      await refetch();
    } else {
      // create
      const resp = await setBusinessInfo(currentUser().userId!, data as ConvertBusinessProspectRequest);
      mutate([{ ...currentUser(), userId: resp.businessOwnerId! }, resp.business as Business, null]);
    }
    sendAnalyticsEvent({ name: Events.SUBMIT_BUSINESS_DETAILS });
    setStep(OnboardingStep.BUSINESS_OWNERS);
  };

  const getMinutesRemaining = (currentStep?: OnboardingStep) => {
    switch (currentStep) {
      case OnboardingStep.TRANSFER_MONEY:
        return `2`;
      case OnboardingStep.LINK_ACCOUNT:
        return `4`;
      case OnboardingStep.REVIEW:
      case OnboardingStep.SOFT_FAIL:
        return `6`;
      case OnboardingStep.BUSINESS_OWNERS:
        return `10`;
      case OnboardingStep.BUSINESS:
      default:
        return `12`;
    }
  };

  const onUpdateKYC = async () => {
    try {
      sendAnalyticsEvent({ name: Events.SUBMIT_BUSINESS_LEADERSHIP });
      await triggerBusinessOwners();
      await refetch();
      const reviewRequirements = await getApplicationReviewRequirements();

      setKYBRequiredDocuments(reviewRequirements.kybRequiredDocuments);
      setKYCRequiredDocuments(reviewRequirements.kycRequiredDocuments);

      setKybRequiredFields(reviewRequirements.kybRequiredFields);
      setKycRequiredFields(reviewRequirements.kycRequiredFields);

      if (reviewRequirements.kybRequiredFields.length > 0) {
        setStep(OnboardingStep.BUSINESS);
      } else if (Object.keys(reviewRequirements.kycRequiredFields).length > 0) {
        setStep(OnboardingStep.BUSINESS_OWNERS);
      } else if (
        reviewRequirements.kycRequiredDocuments.length > 0 ||
        reviewRequirements.kybRequiredDocuments.length > 0
      ) {
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
      sendAnalyticsEvent({ name: Events.LINK_BANK });
      setStep(OnboardingStep.TRANSFER_MONEY);
    });
  };

  const onDeposit = async (accountId: string, amount: number) => {
    await bankTransaction('DEPOSIT', accountId, amount);
    await refetch();
    storage.set(ONBOARDING_BANK_ACCOUNTS_STORAGE_KEY, []);
    storage.set(ONBOARDING_LEADERS_KEY, []);
    sendAnalyticsEvent({ name: Events.DEPOSIT_CASH, data: { amount } });
    sendAnalyticsEvent({ name: Events.ONBOARDING_COMPLETE });
    navigate('/');
  };

  const checkReviewStatus = async () => {
    await refetch();
    if (business()?.onboardingStep !== 'REVIEW') {
      setStep(business()?.onboardingStep as OnboardingStep);
    }
  };

  const skipDeposit = async () => {
    await completeOnboarding();
    await refetch();
    sendAnalyticsEvent({ name: Events.SKIP_DEPOSIT });
    sendAnalyticsEvent({ name: Events.ONBOARDING_COMPLETE });
    navigate('/');
  };

  const onLeaderUpdate = (leaderId: string) => {
    setKycRequiredFields({
      ...kycRequiredFields(),
      [leaderId]: [],
    });
  };

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
              <Text
                message="Estimated time remaining: {minutes} {minutes, plural, one {minute} other {minutes}}"
                minutes={getMinutesRemaining(step())}
              />
            </div>
            <div class={css.steps}>
              <SideSteps step={step()} />
            </div>
          </Show>
          <footer class={css.footer}>
            <div>
              <Icon name="user" />
              <span class={css.user}>{formatName(currentUser())}</span>
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
          <Match when={step() === OnboardingStep.BUSINESS || (!step() && businessProspectInfo()?.businessType)}>
            <Page
              title={<Text message="First, tell us a little bit about your business" />}
              headerClass={css.border}
              titleClass={css.thin}
            >
              <BusinessForm
                onNext={onUpdateKYB}
                businessType={businessProspectInfo()?.businessType ?? business()?.businessType!}
                businessPrefills={business()! as BusinessWithBusinessName}
                kybErrors={kybRequiredFields()}
              />
            </Page>
          </Match>
          <Match when={step() === OnboardingStep.BUSINESS_OWNERS}>
            <Page title={teamTitle} headerClass={css.border} titleClass={css.thin}>
              <TeamForm
                business={business()}
                kycErrors={kycRequiredFields()}
                setTitle={setTeamTitle}
                onNext={onUpdateKYC}
                onLeaderUpdate={onLeaderUpdate}
                currentUser={currentUser()}
              />
            </Page>
          </Match>
          <Match when={step() === OnboardingStep.SOFT_FAIL}>
            <Page title={<Text message="Just a few more things..." />} headerClass={css.border} titleClass={css.thin}>
              <SoftFail
                kybRequiredDocuments={kybRequiredDocuments()}
                kycRequiredDocuments={kycRequiredDocuments()}
                onNext={onSoftFail}
              />
            </Page>
          </Match>
          <Match when={step() === OnboardingStep.REVIEW}>
            <Review ownerEmail={currentUser().email || ''} refetch={checkReviewStatus} />
          </Match>
          <Match when={step() === OnboardingStep.LINK_ACCOUNT}>
            <Page
              title={<Text message="Show us the money! Well...kind of. It's time to link your bank account 💰" />}
              headerClass={css.border}
              titleClass={css.thin}
            >
              <LinkAccountStep onSuccess={onGotVerifyToken} skipDeposit={skipDeposit} />
            </Page>
          </Match>
          <Match when={step() === OnboardingStep.TRANSFER_MONEY}>
            <Page
              title={
                <Text message="One last thing! To start issuing ClearSpend cards, you must have at least $100 in your account" />
              }
              headerClass={css.border}
              titleClass={css.thin}
            >
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
