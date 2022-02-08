import { createSignal, For } from 'solid-js';
import { Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { Icon } from '_common/components/Icon';
import { Drawer } from '_common/components/Drawer';
import { Section } from 'app/components/Section';
import { Data } from 'app/components/Data';
import { formatCardNumber } from 'cards/utils/formatCardNumber';
import { LinkAccount } from 'onboarding/containers/LinkAccount';
import { getBankAccounts, linkBankAccounts } from 'onboarding/services/accounts';

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
              <div class={css.account} onClick={() => setViewAccountId(item.businessBankAccountId)}>
                <div class={css.icon}>
                  <Icon name="payment-bank" />
                </div>
                <div>
                  <div class={css.name}>{item.name}</div>
                  <div class={css.number}>{formatCardNumber(item.accountNumber)}</div>
                </div>
                <Icon name="chevron-right" />
              </div>
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
