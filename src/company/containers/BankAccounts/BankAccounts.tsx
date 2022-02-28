import { createMemo, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { Section } from 'app/components/Section';
import { Data } from 'app/components/Data';
import { LinkAccount } from 'onboarding/containers/LinkAccount';
import { getBankAccounts, linkBankAccounts } from 'onboarding/services/accounts';

import { AccountItem } from '../../components/AccountItem';

import css from './BankAccounts.css';

// TODO: waiting for backend update CAP-537
export function BankAccounts() {
  const [accounts, accountsStatus, , , reloadAccounts] = useResource(getBankAccounts);

  const onAddAccount = async (token: string) => {
    await linkBankAccounts(token);
    await reloadAccounts();
  };

  const onRemoveAccount = async () => {
    return Promise.resolve();
  };

  const extraProps = createMemo(() => {
    if (accounts()?.length) {
      return {
        description:
          'To change this bank account, please unlink it first. Unlinking this account will not affect any pending transfers.',
      };
    }
    return {};
  });

  return (
    <Section
      title={<Text message="Your company bank account" />}
      class={css.section}
      contentClass={css.sectionContent}
      {...extraProps()}
    >
      <Data
        data={accounts()}
        loading={accountsStatus().loading}
        error={accountsStatus().error}
        onReload={reloadAccounts}
      >
        <Show when={accounts()![0]} fallback={<LinkAccount disabled onSuccess={onAddAccount} />}>
          {(account) => <AccountItem data={account} onUnlink={onRemoveAccount} />}
        </Show>
      </Data>
    </Section>
  );
}
