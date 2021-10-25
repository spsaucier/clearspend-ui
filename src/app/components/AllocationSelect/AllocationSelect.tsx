import { Select, Option } from '_common/components/Select';
import { Divider } from '_common/components/Divider';
import { formatCurrency } from '_common/api/intl/formatCurrency';

import css from './AllocationSelect.css';

interface AllocationSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function AllocationSelect(props: Readonly<AllocationSelectProps>) {
  return (
    <Select
      value={props.value}
      valueRender={(_, txt) => (
        <span class={css.value}>
          <span class={css.name}>{txt}</span>
          <span>&nbsp;|&nbsp;</span>
          {/* eslint-disable-next-line @typescript-eslint/no-magic-numbers */}
          <strong class={css.amount}>{formatCurrency(54570.04)}</strong>
        </span>
      )}
      class={css.root}
      onChange={props.onChange}
    >
      <Option value="1">North Valley Enterprises</Option>
      <Option value="2">Marketing</Option>
      <Option value="3">Sales</Option>
      <Divider />
      <Option value="ALL">All allocations</Option>
    </Select>
  );
}
