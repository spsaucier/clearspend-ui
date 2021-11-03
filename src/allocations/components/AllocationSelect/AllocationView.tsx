import { formatCurrency } from '_common/api/intl/formatCurrency';

import css from './AllocationView.css';

interface AllocationViewProps {
  name: string;
  amount: number;
}

export function AllocationView(props: Readonly<AllocationViewProps>) {
  return (
    <span class={css.value}>
      <span class={css.name}>{props.name}</span>
      <span>&nbsp;|&nbsp;</span>
      <strong class={css.amount}>{formatCurrency(props.amount)}</strong>
    </span>
  );
}
