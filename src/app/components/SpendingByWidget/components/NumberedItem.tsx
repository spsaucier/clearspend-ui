import type { JSXElement } from 'solid-js';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import type { Amount } from 'generated/capital';

import css from './NumberedItem.css';

interface NumberedItemProps {
  num: number;
  name: JSXElement;
  amount: Readonly<Amount>;
  onClick?: () => void;
}

export function NumberedItem(props: Readonly<NumberedItemProps>) {
  return (
    <li class={css.root}>
      <span class={css.num}>{props.num}.</span>
      <span class={css.title} classList={{ [css.clickable!]: Boolean(props.onClick) }} onClick={props.onClick}>
        {props.name}
      </span>
      <span class={css.amount}>{formatCurrency(props.amount.amount || 0)}</span>
    </li>
  );
}
