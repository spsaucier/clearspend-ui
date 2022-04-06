import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { Section } from 'app/components/Section';
import { Data } from 'app/components/Data';
import { LinkAccount } from 'onboarding/containers/LinkAccount';
import { getBankAccounts, linkBankAccounts, unregisterBankAccount } from 'onboarding/services/accounts';

import { AccountItem } from '../../components/AccountItem';

import css from './BankAccounts.css';

// TODO: waiting for backend update CAP-537
export function BankAccounts() {
  const [accounts, accountsStatus, , , reloadAccounts] = useResource(getBankAccounts);

  const onAddAccount = async (token: string) => {
    await linkBankAccounts(token);
    await reloadAccounts();
  };

  const onRemoveAccount = async (businessBankAccountId: string) => {
    await unregisterBankAccount(businessBankAccountId);
    await reloadAccounts();
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
        onReload={reloadAccounts}
      >
        <Show when={accounts()![0]} fallback={<LinkAccount onSuccess={onAddAccount} />}>
          {(account) => <AccountItem data={account} onUnlink={onRemoveAccount} />}
        </Show>
      </Data>
    </Section>
  );
}
