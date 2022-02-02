import { For } from 'solid-js';

import { Select, Option } from '_common/components/Select';
import type { Allocation } from 'generated/capital';
import { i18n } from '_common/api/intl';

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
  showAllAsOption?: boolean;
  error?: boolean;
  onChange: (value: string) => void;
}

export const ALL_ALLOCATIONS = 'all';

export function AllocationSelect(props: Readonly<AllocationSelectProps>) {
  const renderValue = (id: string) => {
    if (!id || id === ALL_ALLOCATIONS)
      return <AllocationView name={String(i18n.t('All allocations'))} amount={getTotalAmount(props.items)} />;

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
      {props.showAllAsOption && <Option value={ALL_ALLOCATIONS}>{String(i18n.t('All allocations'))}</Option>}
      <For each={props.items}>{(item) => <Option value={item.allocationId}>{item.name}</Option>}</For>
    </Select>
  );
}
