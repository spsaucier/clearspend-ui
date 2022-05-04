import { Show, Switch, Match } from 'solid-js';

import { Link } from '_common/components/Link';
import { formatAccountNumber } from 'cards/utils/formatAccountNumber';
import type {
  LedgerActivityResponse,
  LedgerAllocationAccount,
  LedgerBankAccount,
  LedgerCardAccount,
  LedgerMerchantAccount,
} from 'generated/capital';

import { Account } from '../Account';
import { MerchantLogo } from '../MerchantLogo';

import css from './ActivityAccount.css';

interface ActivityAccountProps {
  account: LedgerActivityResponse['sourceAccount'];
  onCardClick?: (cardId: string) => void;
}

export function ActivityAccount(props: Readonly<ActivityAccountProps>) {
  return (
    <Show when={props.account}>
      {(account) => (
        <Switch>
          <Match when={account.type === 'ALLOCATION' && (account as LedgerAllocationAccount).allocationInfo}>
            {(allocation) => (
              <Account
                icon="allocations"
                name={
                  <Link href={`/allocations/${allocation.allocationId}`} onClick={(event) => event.stopPropagation()}>
                    {allocation.name}
                  </Link>
                }
              />
            )}
          </Match>
          <Match when={account.type === 'BANK' && (account as LedgerBankAccount).bankInfo}>
            {(bank) => (
              <Account icon="payment-bank" name={bank.name} extra={formatAccountNumber(bank.accountNumberLastFour)} />
            )}
          </Match>
          <Match when={account.type === 'CARD' && (account as LedgerCardAccount).cardInfo}>
            {(card) => (
              <Account
                icon="card"
                name={
                  <div
                    class={css.user}
                    classList={{ [css.link!]: !!props.onCardClick }}
                    onClick={(event) => {
                      event.stopPropagation();
                      props.onCardClick?.(card.cardId!);
                    }}
                  >
                    {formatAccountNumber(card.lastFour)}
                  </div>
                }
                extra={card.allocationName}
              />
            )}
          </Match>
          <Match when={account.type === 'MERCHANT' && (account as LedgerMerchantAccount).merchantInfo}>
            {(merchant) => <Account noWrapIcon icon={<MerchantLogo data={merchant} />} name={merchant.name} />}
          </Match>
        </Switch>
      )}
    </Show>
  );
}
