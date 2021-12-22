import { Show } from 'solid-js';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import type { Amount } from 'generated/capital';

import css from './Merchant.css';

interface MerchantProps {
  icon?: string;
  name: string;
  amount: Readonly<Amount>;
}

export function Merchant(props: Readonly<MerchantProps>) {
  return (
    <li class={css.root}>
      <span class={css.icon}>
        <Show when={props.icon}>
          <img src={props.icon} alt={props.name} />
        </Show>
      </span>
      <span>{props.name}</span>
      <span class={css.amount}>{formatCurrency(props.amount.amount)}</span>
    </li>
  );
}
