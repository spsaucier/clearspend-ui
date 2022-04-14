import { createSignal, batch, Show, Switch, Match } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { useI18n, Text } from 'solid-i18n';

import logoLight from 'app/assets/Tagline_Lockup_White.svg';
import { Icon } from '_common/components/Icon';
import { storage } from '_common/api/storage';
import { isFetchError } from '_common/api/fetch/isFetchError';
import { useMediaContext } from '_common/api/media/context';
import { MainLayout } from 'app/components/MainLayout';
import { Page } from 'app/components/Page';
import { useOnboardingBusiness } from 'app/containers/Main/context';
import { useMessages } from 'app/containers/Messages/context';
import { OnboardingStep } from 'app/types/businesses';
import { formatName } from 'employees/utils/formatName';
import { uploadForApplicationReview } from 'app/services/review';
import type {
  BankAccount,
  Business,
  ConvertBusinessProspectRequest,
  UpdateBusiness,
  ControllerError,
} from 'generated/capital';
import { wrapAction } from '_common/utils/wrapAction';
import { logout } from 'app/services/auth';
import { AppEvent } from 'app/types/common';
import { events } from '_common/api/events';
import { Button } from '_common/components/Button';
import { completeOnboarding } from 'allocations/services';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';
import { Modal } from '_common/components/Modal';
import { LoadingPage } from '_common/components/LoadingPage/LoadingPage';
import { Link } from '_common/components/Link';

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
  const i18n = useI18n();
  const media = useMediaContext();
  const messages = useMessages();
  const navigate = useNavigate();
  const [loadingModalOpen, setLoadingModalOpen] = createSignal(false);

  const { business, currentUser, refetch: refetchOnboardingState, mutate } = useOnboardingBusiness();
  const [businessProspectInfo, setBusinessProspectInfo] = createSignal<{ businessType: Business['type'] }>();
  const [teamTitle, setTeamTitle] = createSignal('');

  const [logoutLoading, logoutAction] = wrapAction(() => logout().then(() => events.emit(AppEvent.Logout)));

  const fillBusinessProspectInfo = async () => {
    const result = await getBusinessProspectInfo(currentUser().userId!);
    if (result.data) {
      setBusinessProspectInfo(result.data as { businessType: Business['type'] });
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

  const [pendingVerification, setPendingVerification] = createSignal<readonly Readonly<string>[]>([]);

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

        setPendingVerification(data.pendingVerification);

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
    try {
      setLoadingModalOpen(true);
      if (business()) {
        // update
        await updateBusinessInfo(data as UpdateBusiness);
        setKYBRequiredDocuments([]);
        await refetchOnboardingState();
      } else {
        // create
        const resp = await setBusinessInfo(currentUser().userId!, data as ConvertBusinessProspectRequest);
        mutate({ currentUser: { ...currentUser(), userId: resp.businessOwnerId! }, business: resp.business! });
      }
      sendAnalyticsEvent({ name: Events.SUBMIT_BUSINESS_DETAILS });
      setLoadingModalOpen(false);
      setStep(OnboardingStep.BUSINESS_OWNERS);
    } catch (e: unknown) {
      const error = e as { data?: { message?: string; param?: string } };
      if (error.data?.param) {
        // TODO: Update/re-test once @B.George syncs on fields
        setKybRequiredFields([error.data.param]);
      } // TODO: Improve once field data comes through
      else if (error.data?.message?.includes('Duplicate employer identification number')) {
        setKybRequiredFields(['employerIdentificationNumber']);
      }

      setLoadingModalOpen(false);
      messages.error({
        title: i18n.t('Something went wrong'),
        message: isFetchError<ControllerError>(e) ? e.data.message : undefined,
      });
    }
  };

  const onUpdateKYC = async (skipTrigger?: boolean) => {
    setLoadingModalOpen(true);
    try {
      if (!skipTrigger) {
        await triggerBusinessOwners();
      }
      await refetchOnboardingState();
      const reviewRequirements = await getApplicationReviewRequirements();
      setLoadingModalOpen(false);

      setKYBRequiredDocuments(reviewRequirements.kybRequiredDocuments);
      setKYCRequiredDocuments(reviewRequirements.kycRequiredDocuments);

      setKybRequiredFields(reviewRequirements.kybRequiredFields);
      setKycRequiredFields(reviewRequirements.kycRequiredFields);

      setPendingVerification(reviewRequirements.pendingVerification);

      if (reviewRequirements.kybRequiredFields.length > 0) {
        setStep(OnboardingStep.BUSINESS);
      } else if (Object.keys(reviewRequirements.kycRequiredFields).length > 0) {
        setStep(OnboardingStep.BUSINESS_OWNERS);
      } else if (
        reviewRequirements.kycRequiredDocuments.length > 0 ||
        reviewRequirements.kybRequiredDocuments.length > 0
      ) {
        sendAnalyticsEvent({ name: Events.SUPPLEMENTAL_INFO_REQUIRED });
        setStep(OnboardingStep.SOFT_FAIL);
      } else {
        if (reviewRequirements.pendingVerification.length === 0) {
          sendAnalyticsEvent({ name: Events.SUBMIT_BUSINESS_LEADERSHIP });
          setStep(OnboardingStep.LINK_ACCOUNT);
        } else {
          setStep(OnboardingStep.REVIEW);
        }
      }
    } catch (err: unknown) {
      setLoadingModalOpen(false);
      messages.error({ title: 'Something went wrong' });
      setStep(OnboardingStep.BUSINESS_OWNERS);
    }
    setLoadingModalOpen(false);
  };

  const onSoftFail = async (data: Readonly<{}>) => {
    await uploadForApplicationReview(data);
    setLoadingModalOpen(false);
    sendAnalyticsEvent({ name: Events.SUPPLEMENTAL_INFO_SUBMITTED });
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

  const checkReviewStatus = async () => {
    await refetchOnboardingState();
    if (business()?.onboardingStep !== 'REVIEW') {
      setPendingVerification([]);
      setStep(business()?.onboardingStep as OnboardingStep);
    }
  };

  const onLeaderUpdate = (leaderId: string) => {
    setKycRequiredFields({
      ...kycRequiredFields(),
      [leaderId]: [],
    });
  };

  const onDeposit = async (accountId: string, amount: number) => {
    await bankTransaction('DEPOSIT', accountId, amount);
    storage.set(ONBOARDING_BANK_ACCOUNTS_STORAGE_KEY, []);
    storage.set(ONBOARDING_LEADERS_KEY, []);
    sendAnalyticsEvent({ name: Events.DEPOSIT_CASH, data: { amount } });
    sendAnalyticsEvent({ name: Events.APPLICATION_APPROVED });
    triggerCompleteOnboarding();
  };
  const onSkipDeposit = async () => {
    // temp patch while backend resolves issue of pending verification to proper business step
    if (pendingVerification().length > 0) {
      await onUpdateKYC(true);
      return;
    }

    sendAnalyticsEvent({ name: Events.SKIP_DEPOSIT });
    sendAnalyticsEvent({ name: Events.APPLICATION_APPROVED });
    triggerCompleteOnboarding();
  };

  const triggerCompleteOnboarding = async () => {
    await completeOnboarding();
    await refetchOnboardingState();
    sendAnalyticsEvent({ name: Events.ONBOARDING_COMPLETE });
    navigate('/');
  };

  return (
    <MainLayout
      darkSide
      side={
        <div class={css.sidebar}>
          <header class={css.header}>
            <img src={logoLight} alt="Company logo" width={189} height={70} />
          </header>
          <Show when={media.medium}>
            <div class={css.estimated}>
              <Icon size={'md'} name={'clock'} />
              <Text message="Estimated time remaining: {minutes} min" minutes={getMinutesRemaining(step())} />
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
              class={css.signOutBtn}
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
                businessType={businessProspectInfo()?.businessType ?? business()?.type!}
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
                setLoadingModalOpen={setLoadingModalOpen}
              />
            </Page>
          </Match>
          <Match when={step() === OnboardingStep.SOFT_FAIL}>
            <Page title={<Text message="Just a few more things..." />} headerClass={css.border} titleClass={css.thin}>
              <SoftFail
                kybRequiredDocuments={kybRequiredDocuments()}
                kycRequiredDocuments={kycRequiredDocuments()}
                onNext={onSoftFail}
                setLoadingModalOpen={setLoadingModalOpen}
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
              <LinkAccountStep
                disabled={pendingVerification().length > 0}
                onSuccess={onGotVerifyToken}
                skipDeposit={onSkipDeposit}
                onCheckVerification={() => onUpdateKYC(true)}
              />
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
          <Match when={!step()}>
            <Page
              title={<Text message="Hmm... something isn't right here." />}
              headerClass={css.border}
              titleClass={css.thin}
            >
              <p>
                <Text message="Please contact " />
                <Link href="mailto:help@clearspend.com">help@clearspend.com</Link>
                <Text message=" and let us know about this issue. We'll get you back on track!" />
              </p>
            </Page>
          </Match>
        </Switch>
      </div>
      <Modal isOpen={loadingModalOpen()}>
        <LoadingPage />
      </Modal>
    </MainLayout>
  );
}

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
