import { For, createMemo } from 'solid-js';

import { Select, Option } from '_common/components/Select';
import type { Allocation, UserRolesAndPermissionsRecord } from 'generated/capital';
import { i18n } from '_common/api/intl';
import { useBusiness } from 'app/containers/Main/context';
import { MultiSelect, Option as MultiOption } from '_common/components/MultiSelect';

import { allocationWithID } from '../../utils/allocationWithID';
import { getAvailableBalance } from '../../utils/getAvailableBalance';
import { getTotalAvailableBalance } from '../../utils/getTotalAvailableBalance';
import { AllocationView } from '../AllocationView';
import { Breadcrumbs } from '../Breadcrumbs';
import { getRootAllocation } from '../../utils/getRootAllocation';

import { createSortedNestedArray, parentsChain } from './utils';

import css from './AllocationSelect.css';

interface AllocationSelectProps {
  items: readonly Readonly<Allocation>[] | null;
  excludedIds?: readonly Readonly<string>[];
  disabledSelectedIds?: readonly Readonly<string>[];
  value?: string;
  values?: string[];
  disabled?: boolean;
  class?: string;
  placeholder?: string;
  showAllAsOption?: boolean;
  error?: boolean;
  showArchived?: boolean;
  onChange?: (value: string) => void;
  onChangeMulti?: (value: string[]) => void;
  permissionCheck?: (permissions: UserRolesAndPermissionsRecord) => boolean;
}

export const ALL_ALLOCATIONS = 'all';
const PX_INDENT = 10;

export function AllocationSelect(props: Readonly<AllocationSelectProps>) {
  const { currentUserRoles } = useBusiness();

  const renderValue = (id: string) => {
    if (!id || id === ALL_ALLOCATIONS)
      return <AllocationView name={String(i18n.t('All allocations'))} amount={getTotalAvailableBalance(props.items)} />;

    const found = props.items?.find(allocationWithID(id));
    if (!found) return null;

    return (
      <AllocationView
        name={<Breadcrumbs current={found} items={props.items || []} /> || found.name}
        amount={getAvailableBalance(found)}
      />
    );
  };

  const byPermissionsCheck = (a: Allocation) => {
    const currentPermissions = currentUserRoles().find((r) => r.allocationId === a.allocationId);
    if (!props.permissionCheck || !currentPermissions) return true;
    return props.permissionCheck(currentPermissions);
  };

  const allocations = createMemo(() => {
    if (getRootAllocation(props.items)) {
      return createSortedNestedArray(props.items)
        .filter((a) => props.showArchived || !a.archived)
        .filter(byPermissionsCheck);
    }
    return (
      props.items
        ?.map((a) => ({ ...a, nestLevel: parentsChain(a, [...props.items!]).length }))
        .filter((a) => props.showArchived || !a.archived)
        .filter(byPermissionsCheck) || []
    );
  });

  if (props.onChangeMulti) {
    return (
      <MultiSelect
        name="allocation"
        value={props.values}
        disabled={props.disabled}
        placeholder={props.placeholder}
        disabledValues={props.disabledSelectedIds || []}
        error={props.error}
        valueRender={renderValue}
        class={props.class}
        popupClass={css.popup}
        onChange={props.onChangeMulti}
      >
        <For each={allocations()}>
          {(item) => (
            <MultiOption
              value={item.allocationId}
              disabled={
                (props.excludedIds || []).includes(item.allocationId) ||
                ((props.disabledSelectedIds || []).includes(item.allocationId) &&
                  props.values?.includes(item.allocationId))
              }
            >
              <span style={{ 'padding-left': `${PX_INDENT * Math.max(item.nestLevel - 1, 0)}px` }}>{item.name}</span>
            </MultiOption>
          )}
        </For>
      </MultiSelect>
    );
  }
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
          <Option
            value={item.allocationId}
            disabled={
              (props.excludedIds || []).includes(item.allocationId) ||
              ((props.disabledSelectedIds || []).includes(item.allocationId) &&
                props.values?.includes(item.allocationId))
            }
          >
            <span style={{ 'padding-left': `${PX_INDENT * Math.max(item.nestLevel - 1, 0)}px` }}>{item.name}</span>
          </Option>
        )}
      </For>
    </Select>
  );
}
