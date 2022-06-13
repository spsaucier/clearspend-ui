import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { HttpStatus } from '_common/api/fetch/types';
import { Section } from 'app/components/Section';
import { Data } from 'app/components/Data';
import { LinkAccount } from 'onboarding/containers/LinkAccount';
import {
  getBankAccounts,
  linkBankAccounts,
  registerBankAccount,
  unregisterBankAccount,
} from 'onboarding/services/accounts';
import { useMessages } from 'app/containers/Messages/context';
import { Events, sendAnalyticsEvent } from 'app/utils/analytics';
import { RelinkAccountButton } from 'onboarding/containers/LinkAccount/RelinkAccountButton';
import { useLoc } from '_common/api/router';

import { AccountItem } from '../../components/AccountItem';

import css from './BankAccounts.css';

export function BankAccounts() {
  const [accounts, accountsStatus, , , refetchAccounts] = useResource(getBankAccounts);
  const messages = useMessages();
  const location = useLoc<{ relink: boolean }>();

  const onAddAccount = async (token: string, accountName?: string) => {
    try {
      const bankAccountsCall = await linkBankAccounts(token);
      if (bankAccountsCall.status === HttpStatus.OK) {
        const bankAccounts = bankAccountsCall.data;
        const matchedAccounts = accountName
          ? bankAccounts.filter((account) => account.name === accountName && account.businessBankAccountId)
          : bankAccounts.filter((account) => account.businessBankAccountId);
        await Promise.all(matchedAccounts.map((account) => registerBankAccount(account.businessBankAccountId)));
        sendAnalyticsEvent({ name: Events.LINK_BANK });
        messages.success({ title: 'Bank account linked successfully' });
      }
    } catch (e: unknown) {
      // eslint-disable-next-line no-console
      console.error(e);
      messages.error({ title: 'Unable to link bank account' });
    }
    await refetchAccounts();
  };

  const onRemoveAccount = async (businessBankAccountId: string) => {
    await unregisterBankAccount(businessBankAccountId).catch((e: { data?: { message: string } }) => {
      messages.error({ title: 'Unable to unlink bank account', message: e.data?.message });
    });
    await refetchAccounts();
  };

  return (
    <Section
      title={<Text message="Your company bank account" />}
      description={
        !!accounts()?.length && (
          <Text
            message={
              'To change this bank account, please unlink it first. ' +
              'Unlinking this account will not affect any pending transfers.'
            }
          />
        )
      }
      class={css.section}
      contentClass={css.sectionContent}
    >
      <Data
        data={accounts()}
        loading={accountsStatus().loading}
        error={accountsStatus().error}
        onReload={refetchAccounts}
      >
        <Show when={accounts()![0]} fallback={<LinkAccount onSuccess={onAddAccount} />}>
          {(account) => (
            <>
              <AccountItem data={account} onUnlink={onRemoveAccount} />
              <Show when={location.search.indexOf('relink') > -1 || account.accountLinkStatus === 'RE_LINK_REQUIRED'}>
                <div style={{ margin: '5px 0' }}>
                  <RelinkAccountButton onSuccess={onAddAccount} bankAccountId={account.businessBankAccountId} />
                </div>
              </Show>
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
      </Data>
    </Section>
  );
}
