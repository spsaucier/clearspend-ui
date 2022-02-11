import { createSignal, For } from 'solid-js';
import { Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { Drawer } from '_common/components/Drawer';
import { Section } from 'app/components/Section';
import { Data } from 'app/components/Data';
import { formatAccountNumber } from 'cards/utils/formatAccountNumber';
import { LinkAccount } from 'onboarding/containers/LinkAccount';
import { getBankAccounts, linkBankAccounts } from 'onboarding/services/accounts';

import { AccountItem } from '../../components/AccountItem';
import { LinkedAccountPreview } from '../LinkedAccountPreview';

import css from './BankAccounts.css';

export function BankAccounts() {
  const [viewAccountId, setViewAccountId] = createSignal<string>();
  const [accounts, accountsStatus, , , reloadAccounts] = useResource(getBankAccounts);

  const onAddAccount = async (token: string) => {
    await linkBankAccounts(token);
    await reloadAccounts();
  };

  return (
    <div>
      <Section
        title={<Text message="Linked accounts" />}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tempor."
        class={css.section}
        contentClass={css.sectionContent}
      >
        <Data
          data={accounts()}
          loading={accountsStatus().loading}
          error={accountsStatus().error}
          onReload={reloadAccounts}
        >
          <For each={accounts()!}>
            {(item) => (
              <AccountItem
                icon="payment-bank"
                title={item.name}
                text={formatAccountNumber(item.accountNumber)}
                onClick={() => setViewAccountId(item.businessBankAccountId)}
              />
            )}
          </For>
        </Data>
      </Section>
      <Section
        title={<Text message="Add new account" />}
        description="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tempor."
        class={css.section}
        contentClass={css.sectionContent}
      >
        {/* TODO: waiting for backend update */}
        <LinkAccount disabled onSuccess={onAddAccount} />
      </Section>
      <Drawer
        open={Boolean(viewAccountId())}
        title={<Text message="Linked account" />}
        onClose={() => setViewAccountId()}
      >
        <LinkedAccountPreview accountId={viewAccountId()!} />
      </Drawer>
    </div>
  );
}
