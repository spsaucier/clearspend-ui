import { useContext, createSignal, batch, Show, Switch, Match } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { Icon } from '_common/components/Icon';
import { useMediaContext } from '_common/api/media/context';
import { MainLayout } from 'app/components/MainLayout';
import { Page } from 'app/components/Page';
import { BusinessContext } from 'app/containers/Main/context';
import { useMessages } from 'app/containers/Messages/context';
import { OnboardingStep } from 'app/types/businesses';
import { formatName } from 'employees/utils/formatName';
import { uploadForManualReview } from 'app/services/review';
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
import { LinkAccount } from './components/LinkAccount';
import { TransferMoney } from './components/TransferMoney';
import { getRequiredDocuments, setBusinessInfo, setBusinessOwner } from './services/onboarding';
import { linkBankAccounts, getBankAccounts, deposit } from './services/accounts';
import { Review, SoftFail } from './components/SoftFail';
import type { KycDocuments, RequiredDocument } from './components/SoftFail/types';

import css from './Onboarding.css';

export default function Onboarding() {
  const media = useMediaContext();
  const messages = useMessages();
  const navigate = useNavigate();

  const { business, owner, refetch, mutate } = useContext(BusinessContext)!;

  const [step, setStep] = createSignal<OnboardingStep | undefined>(business()?.onboardingStep as OnboardingStep);
  const [accounts, setAccounts] = createSignal<readonly Readonly<BankAccount>[]>([]);

  const [kybRequiredDocuments, setkybRequiredDocuments] = createSignal<readonly Readonly<RequiredDocument>[]>();
  const [kycRequiredDocuments, setkycRequiredDocuments] = createSignal<readonly Readonly<KycDocuments>[]>();

  if (business()?.onboardingStep === OnboardingStep.TRANSFER_MONEY) {
    getBankAccounts()
      .then((data) => setAccounts(data))
      .catch(() => messages.error({ title: 'Something went wrong' }));
  }

  if (step() === OnboardingStep.SOFT_FAIL) {
    getRequiredDocuments()
      .then((data) => {
        setkybRequiredDocuments(data.kybRequiredDocuments);
        setkycRequiredDocuments(data.kycRequiredDocuments);
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
    const resp = await setBusinessInfo(owner().userId!, data);
    mutate([{ ...owner(), userId: resp.businessOwnerId }, resp.business as Business]);
    setStep(OnboardingStep.BUSINESS_OWNERS);
  };

  const onUpdateKYC = async (data: Readonly<CreateOrUpdateBusinessOwnerRequest>) => {
    await setBusinessOwner(owner().userId!, { ...data, isOnboarding: true });
    await refetch();
    await getRequiredDocuments()
      .then((responseData) => {
        setkybRequiredDocuments(responseData.kybRequiredDocuments);
        setkycRequiredDocuments(responseData.kycRequiredDocuments);
      })
      .catch(() => messages.error({ title: 'Something went wrong' }));
    if (
      (kybRequiredDocuments() && kybRequiredDocuments()!.length > 0) ||
      (kycRequiredDocuments() && kycRequiredDocuments()!.length > 0)
    ) {
      setStep(OnboardingStep.SOFT_FAIL);
    } else {
      setStep(OnboardingStep.LINK_ACCOUNT);
    }
  };

  const onSoftFail = async (data: Readonly<{}>) => {
    await uploadForManualReview(data);
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
    await deposit(accountId, amount);
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
            <span class={css.user}>{formatName(owner())}</span>
          </footer>
        </div>
      }
    >
      <Switch>
        <Match when={!step()}>
          <Page title="Tell us about your business">
            <BusinessForm onNext={onUpdateKYB} />
          </Page>
        </Match>
        <Match when={step() === OnboardingStep.BUSINESS_OWNERS}>
          <Page title="Tell us about your team">
            <TeamForm onNext={onUpdateKYC} />
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
            <Review ownerEmail={owner().email || ''} />
          </Page>
        </Match>
        <Match when={step() === OnboardingStep.LINK_ACCOUNT}>
          <Page title="Link your bank account">
            <LinkAccount onNext={onGotVerifyToken} />
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
