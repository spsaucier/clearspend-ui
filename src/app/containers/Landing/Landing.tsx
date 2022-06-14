import { Text } from 'solid-i18n';
import { createSignal, Show } from 'solid-js';

import { useNav } from '_common/api/router';
import { HttpStatus } from '_common/api/fetch/types';
import { Button } from '_common/components/Button';
import { useResource } from '_common/utils/useResource';
import { Modal, ModalCard } from '_common/components/Modal';
import { storage } from '_common/api/storage';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';
import { InternalBankAccount } from 'onboarding/components/InternalBankAccount';
import { LinkAccountButton } from 'onboarding/containers/LinkAccount/LinkAccountButton';
import { getBankAccounts, linkBankAccounts, registerBankAccount } from 'onboarding/services/accounts';
import { useUsersList } from 'employees/stores/usersList';

import { USERS_START_COUNT } from '../../constants/common';
import { useMessages } from '../Messages/context';
import { RelinkAccountButton } from '../../../onboarding/containers/LinkAccount/RelinkAccountButton';
import { LinkAccount } from '../../../onboarding/containers/LinkAccount';

import { LandingCard } from './LandingCard';

import css from './Landing.css';

const SHOW_ONBOARDING_MODAL = 'SHOW_ONBOARDING_MODAL';

interface LandingProps {
  cardsCount: number;
  showAddBalance: boolean;
  showCreateAllocation: boolean;
  showIssueCard: boolean;
}

export function Landing(props: Readonly<LandingProps>) {
  const navigate = useNav();
  const messages = useMessages();

  const users = useUsersList({ initValue: [] });
  const [accounts, , , , refetchAccounts] = useResource(getBankAccounts);
  const [isOpenCongratulationsModal, setIsOpenCongratulationsModal] = createSignal<boolean>(
    storage.get<boolean>(SHOW_ONBOARDING_MODAL, true),
  );

  const dismissModal = () => {
    storage.set(SHOW_ONBOARDING_MODAL, false);
    setIsOpenCongratulationsModal(false);
  };

  const onAddAccount = async (token: string, accountName?: string) => {
    try {
      const bankAccountsCall = await linkBankAccounts(token);
      if (bankAccountsCall.status === HttpStatus.Accepted) {
        messages.success({ title: 'Bank account link initiated' });
      } else {
        const bankAccounts = bankAccountsCall.data;
        const matchedAccounts = accountName
          ? bankAccounts.filter((account) => account.name === accountName && account.businessBankAccountId)
          : bankAccounts.filter((account) => account.businessBankAccountId);
        await Promise.all(matchedAccounts.map((account) => registerBankAccount(account.businessBankAccountId)));
        messages.success({ title: 'Bank account linked successfully' });
      }
      sendAnalyticsEvent({ name: Events.LINK_BANK });
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.error(e);
      messages.error({ title: 'Unable to link bank account' });
    }
    refetchAccounts();
  };

  return (
    <div class={css.root}>
      <Show when={props.showAddBalance}>
        <LandingCard class={css.card} title={<Text message="Add Balance" />}>
          <Text message="You'll need to add funds to at least one allocation before you can issue cards." />
          <Text
            message={
              'You can deposit funds via a linked bank account, or via ACH or wire transfer to ' +
              'a virtual account ClearSpend has created for you. If you just finished setting up your account, ' +
              'your virtual account will be available in about 30 minutes.'
            }
          />
          <InternalBankAccount
            numberLinesOnly
            class={css.internalBankAccount}
            fallbackText={
              <Text
                message={
                  'We are working quickly setting your account up. ' +
                  'Please allow 30 min for some features like wire transfers to become available. ' +
                  'You will receive an email notification when your account is ready.'
                }
              />
            }
          />
          <Show when={accounts()?.length === 0}>
            <LinkAccountButton onSuccess={onAddAccount} />
          </Show>
          <Show when={accounts() && accounts()![0]} fallback={<LinkAccount onSuccess={onAddAccount} />}>
            {(account) => (
              <>
                <Show when={account.accountLinkStatus === 'MANUAL_MICROTRANSACTION_PENDING'}>
                  <div style={{ margin: '5px 0' }}>
                    <RelinkAccountButton
                      isMicrodeposits
                      onSuccess={onAddAccount}
                      bankAccountId={account.businessBankAccountId}
                    />
                  </div>
                </Show>
              </>
            )}
          </Show>
        </LandingCard>
      </Show>
      <Show when={users.data?.length === USERS_START_COUNT}>
        <LandingCard
          class={css.card}
          title={<Text message="Onboard your employees" />}
          actions={
            <Button size="lg" icon="user" onClick={() => navigate('/employees/add')} data-name="landing-add-employee">
              <Text message="Onboard your employees" />
            </Button>
          }
        >
          <Text message="Give employees access! Create and manage your team member accounts here." />
        </LandingCard>
      </Show>
      <Show when={props.showCreateAllocation}>
        <LandingCard
          class={css.card}
          title={<Text message="Set up allocations" />}
          actions={
            <Button
              size="lg"
              icon="amount"
              onClick={() => navigate('/allocations/edit')}
              data-name="landing-create-allocation"
            >
              <Text message="Create allocation" />
            </Button>
          }
        >
          <Text message="Create and fund budgets for specific business purposes." />
        </LandingCard>
      </Show>
      <Show when={props.showIssueCard}>
        <LandingCard
          class={css.card}
          title={<Text message="Issue your first card" />}
          actions={
            <Button size="lg" icon="card-add-new" onClick={() => navigate('/cards/new')} data-name="landing-issue-card">
              <Text message="Issue a card" />
            </Button>
          }
        >
          <Text message="It’s time to set up your first ClearSpend card." />
        </LandingCard>
      </Show>

      <Modal isOpen={isOpenCongratulationsModal()} onClose={dismissModal}>
        <ModalCard
          title={<Text message="Congratulations!" />}
          actions={
            <Button size="lg" type="primary" onClick={dismissModal} data-name="go-to-dashboard">
              <Text message="Go to dashboard" />
            </Button>
          }
        >
          <Text
            message={
              'Your account is all set and ready to go! We’re so happy to have you here. ' +
              'Time to make you the expense management superstar you were always meant to be. Let’s get going!'
            }
          />
        </ModalCard>
      </Modal>
    </div>
  );
}
