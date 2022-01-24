import { createMemo, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Button } from '_common/components/Button';
import { isBankAccount } from 'onboarding/components/BankAccounts';
import type { Allocation, BankAccount } from 'generated/capital';

import { AllocationView } from '../AllocationView';

import css from './ManageBalanceSuccess.css';

export interface SuccessData {
  amount: number;
  current: Readonly<Allocation>;
  target: Readonly<Allocation | Required<BankAccount>>;
  withdraw: boolean;
}

interface ManageBalanceSuccessProps {
  data: Readonly<SuccessData>;
  onAgain: () => void;
  onClose: () => void;
}

export function ManageBalanceSuccess(props: Readonly<ManageBalanceSuccessProps>) {
  const currentName = createMemo(() => props.data.current.name);
  const targetName = createMemo(() => props.data.target.name);

  return (
    <>
      <div class={css.status}>
        <h4 class={css.title}>
          <Text message="Success" />
        </h4>
        <Text
          message="You moved <b>{amount}</b> from <b>{from}</b> to <b>{to}</b>"
          amount={formatCurrency(props.data.amount)}
          from={props.data.withdraw ? currentName() : targetName()}
          to={props.data.withdraw ? targetName() : currentName()}
        />
        <h4 class={css.subtitle}>
          <Text message="New balances" />
        </h4>
        <AllocationView
          name={props.data.current.name}
          amount={props.data.current.account.ledgerBalance.amount}
          class={css.item}
        />
        <Show when={!isBankAccount(props.data.target)}>
          <AllocationView
            name={props.data.target.name}
            amount={(props.data.target as Allocation).account.ledgerBalance.amount}
            class={css.item}
          />
        </Show>
      </div>
      <Button wide type="primary" class={css.button} onClick={props.onAgain}>
        <Text message="Manage balance again" />
      </Button>
      <Button wide class={css.button} onClick={props.onClose}>
        <Text message="Close" />
      </Button>
    </>
  );
}
