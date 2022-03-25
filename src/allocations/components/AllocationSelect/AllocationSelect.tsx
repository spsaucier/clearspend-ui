import { For, createMemo } from 'solid-js';

import { Select, Option } from '_common/components/Select';
import type { Allocation } from 'generated/capital';
import { i18n } from '_common/api/intl';

import { allocationWithID } from '../../utils/allocationWithID';
import { getAvailableBalance } from '../../utils/getAvailableBalance';
import { getTotalAvailableBalance } from '../../utils/getTotalAvailableBalance';
import { AllocationView } from '../AllocationView';

import { createSortedNestedArray } from './utils';

import css from './AllocationSelect.css';

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
const PX_INDENT = 10;

export function AllocationSelect(props: Readonly<AllocationSelectProps>) {
  const renderValue = (id: string) => {
    if (!id || id === ALL_ALLOCATIONS)
      return <AllocationView name={String(i18n.t('All allocations'))} amount={getTotalAvailableBalance(props.items)} />;

    const found = props.items.find(allocationWithID(id));
    if (!found) return null;

    return <AllocationView name={found.name} amount={getAvailableBalance(found)} />;
  };

  const allocations = createMemo(() => {
    return createSortedNestedArray(props.items);
  });

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
      <For each={allocations()}>
        {(item) => (
          <Option value={item.allocationId}>
            <span style={{ 'padding-left': `${PX_INDENT * Math.max(item.nestLevel - 1, 0)}px` }}>{item.name}</span>
          </Option>
        )}
      </For>
    </Select>
  );
}
