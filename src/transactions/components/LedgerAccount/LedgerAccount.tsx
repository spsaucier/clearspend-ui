import { Show, Switch, Match } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { AccountCard } from 'app/components/AccountCard';
import { formatAccountNumber } from 'cards/utils/formatAccountNumber';
import type {
  LedgerActivityResponse,
  LedgerAllocationAccount,
  LedgerBankAccount,
  LedgerCardAccount,
  LedgerMerchantAccount,
} from 'generated/capital';

interface LedgerAccountProps {
  account: LedgerActivityResponse['account'];
}

export function LedgerAccount(props: Readonly<LedgerAccountProps>) {
  const navigate = useNavigate();

  return (
    <Show when={props.account}>
      {(account) => (
        <Switch>
          <Match when={account.type === 'ALLOCATION' && (account as LedgerAllocationAccount).allocationInfo}>
            {(allocation) => (
              <AccountCard
                icon="allocations"
                title={allocation.name}
                onClick={() => navigate(`/allocations/${allocation.allocationId}`)}
              />
            )}
          </Match>
          <Match when={account.type === 'BANK' && (account as LedgerBankAccount).bankInfo}>
            {(bank) => (
              <AccountCard
                icon="payment-bank"
                title={bank.name}
                text={formatAccountNumber(bank.accountNumberLastFour)}
              />
            )}
          </Match>
          <Match when={account.type === 'CARD' && (account as LedgerCardAccount).cardInfo}>
            {(card) => (
              <AccountCard
                icon="card"
                title={formatAccountNumber(card.lastFour)}
                text={card.allocationName}
                onClick={() => navigate(`/cards/view/${card.cardId}`)}
              />
            )}
          </Match>
          <Match when={account.type === 'MERCHANT' && (account as LedgerMerchantAccount).merchantInfo}>
            {(merchant) => <AccountCard icon="merchant-services" title={merchant.name} />}
          </Match>
        </Switch>
      )}
    </Show>
  );
}
