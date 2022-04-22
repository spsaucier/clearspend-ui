import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Tag } from '_common/components/Tag';
import { Icon } from '_common/components/Icon';
import type { Allocation } from 'generated/capital';

import { getAvailableBalance } from '../../utils/getAvailableBalance';

import css from './AllocationTag.css';

interface AllocationTagProps {
  data: Readonly<Allocation>;
  class?: string;
}

export function AllocationTag(props: Readonly<AllocationTagProps>) {
  return (
    <Tag class={props.class}>
      <Icon name="allocations" size="sm" class={css.icon} />
      {props.data.name}
      <span>&nbsp;|&nbsp;</span>
      <strong class={css.amount}>{formatCurrency(getAvailableBalance(props.data))}</strong>
    </Tag>
  );
}
