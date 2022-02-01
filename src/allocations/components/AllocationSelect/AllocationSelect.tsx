import { For } from 'solid-js';

import { Select, Option } from '_common/components/Select';
import type { Allocation } from 'generated/capital';

import { allocationWithID } from '../../utils/allocationWithID';
import { AllocationView } from '../AllocationView';

import css from './AllocationSelect.css';

function getTotalAmount(items: readonly Readonly<Allocation>[]): number {
  return items.reduce<number>((sum, item) => sum + item.account.ledgerBalance.amount, 0);
}

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
    if (!id) return <AllocationView name="All allocations" amount={getTotalAmount(props.items)} />;

    const found = props.items.find(allocationWithID(id));
    if (!found) return null;

    return <AllocationView name={found.name} amount={found.account.ledgerBalance.amount} />;
  };

  return (
    <Select
      name="allocation"
      value={props.value}
      disabled={props.disabled}
      placeholder={props.placeholder}
      error={props.error}
      valueRender={renderValue}
      class={props.class}
      popupClass={css.popup}
      onChange={props.onChange}
    >
      <For each={props.items}>{(item) => <Option value={item.allocationId}>{item.name}</Option>}</For>
    </Select>
  );
}
