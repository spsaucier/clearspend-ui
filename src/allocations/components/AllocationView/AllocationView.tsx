import { formatCurrency } from '_common/api/intl/formatCurrency';
import { join } from '_common/utils/join';

import css from './AllocationView.css';

interface AllocationViewProps {
  name: string;
  amount: number;
  class?: string;
}

export function AllocationView(props: Readonly<AllocationViewProps>) {
  return (
    <span class={join(css.root, props.class)}>
      <span class={css.name}>{props.name}</span>
      <span>&nbsp;|&nbsp;</span>
      <strong class={css.amount}>{formatCurrency(props.amount)}</strong>
    </span>
  );
}
