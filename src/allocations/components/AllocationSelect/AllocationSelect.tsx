import { For } from 'solid-js';

import { Select, Option } from '_common/components/Select';
// import { Divider } from '_common/components/Divider';
import { formatCurrency } from '_common/api/intl/formatCurrency';

import type { Allocation } from '../../types';

import css from './AllocationSelect.css';

interface AllocationSelectProps {
  items: readonly Readonly<Allocation>[];
  value?: string;
  disabled?: boolean;
  class?: string;
  placeholder?: string;
  error?: boolean;
  onChange: (value: string) => void;
}

export function AllocationSelect(props: Readonly<AllocationSelectProps>) {
  const renderValue = (id: string) => {
    const allocation = props.items.find((item) => item.allocationId === id)!;

    return (
      <span class={css.value}>
        <span class={css.name}>{allocation.name}</span>
        <span>&nbsp;|&nbsp;</span>
        <strong class={css.amount}>{formatCurrency(allocation.account.ledgerBalance.amount)}</strong>
      </span>
    );
  };

  return (
    <Select
      value={props.value}
      disabled={props.disabled}
      placeholder={props.placeholder}
      error={props.error}
      valueRender={renderValue}
      class={props.class}
      onChange={props.onChange}
    >
      <For each={props.items}>{(item) => <Option value={item.allocationId}>{item.name}</Option>}</For>
      {/*<Divider />*/}
      {/*<Option value="ALL">All allocations</Option>*/}
    </Select>
  );
}
