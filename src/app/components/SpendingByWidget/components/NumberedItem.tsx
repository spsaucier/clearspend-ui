import { formatCurrency } from '_common/api/intl/formatCurrency';
import type { Amount } from 'generated/capital';

import css from './NumberedItem.css';

interface NumberedItemProps {
  num: number;
  name: string;
  amount: Readonly<Amount>;
  onClick: () => void;
}

export function NumberedItem(props: Readonly<NumberedItemProps>) {
  return (
    <li class={css.root}>
      <span class={css.num}>{props.num}.</span>
      <span class={css.title} onClick={props.onClick}>
        {props.name}
      </span>
      <span class={css.amount}>{formatCurrency(props.amount.amount)}</span>
    </li>
  );
}
