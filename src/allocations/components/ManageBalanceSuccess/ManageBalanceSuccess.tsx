import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Button } from '_common/components/Button';

import { AllocationView } from '../AllocationView';

import css from './ManageBalanceSuccess.css';

export interface ManageBalanceSuccessData {
  amount: number;
  fromName: string;
  fromAmount: number;
  toName: string;
  toAmount?: number;
}

interface ManageBalanceSuccessProps extends ManageBalanceSuccessData {
  onAgain: () => void;
  onClose: () => void;
}

export function ManageBalanceSuccess(props: Readonly<ManageBalanceSuccessProps>) {
  return (
    <>
      <div class={css.status}>
        <h4 class={css.title}>
          <Text message="Success" />
        </h4>
        <Text
          message="You moved <b>{amount}</b> from <b>{from}</b> to <b>{to}</b>"
          class={css.text!}
          amount={formatCurrency(props.amount)}
          from={props.fromName}
          to={props.toName}
        />
        <h4 class={css.subtitle}>
          <Text message="New balances" />
        </h4>
        <AllocationView name={props.fromName} amount={props.fromAmount} class={css.item} />
        <Show when={props.toAmount}>
          <AllocationView name={props.toName} amount={props.toAmount!} class={css.item} />
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
