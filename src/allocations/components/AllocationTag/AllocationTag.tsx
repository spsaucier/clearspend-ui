import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Tag } from '_common/components/Tag';
import type { Allocation } from 'generated/capital';

import css from './AllocationTag.css';

interface AllocationTagProps {
  data: Readonly<Allocation>;
  class?: string;
}

export function AllocationTag(props: Readonly<AllocationTagProps>) {
  return (
    <Tag class={props.class}>
      {props.data.name}
      <span>&nbsp;|&nbsp;</span>
      <strong class={css.amount}>{formatCurrency(props.data.account.availableBalance?.amount || 0)}</strong>
    </Tag>
  );
}
