import { createMemo, For } from 'solid-js';
import { useI18n } from 'solid-i18n';

import { Select, Option } from '_common/components/Select';
import type { UserData } from 'generated/capital';
import { formatName } from 'employees/utils/formatName';
import { byUserLastName } from 'allocations/components/AllocationSelect/utils';

import { NewEmployeeButton } from './NewEmployeeButton';

interface SelectEmployeeProps {
  value: string;
  error?: boolean;
  users: readonly Readonly<UserData>[];
  onAddClick: () => void;
  onChange: (value: string) => void;
}

export function SelectEmployee(props: Readonly<SelectEmployeeProps>) {
  const i18n = useI18n();

  // TODO: Remove once we sort in BE: CAP-557
  const sortedUsers = createMemo(() => {
    return [...props.users].sort(byUserLastName);
  });

  return (
    <Select
      name="employee"
      value={props.value}
      placeholder={String(i18n.t('Search by employee name'))}
      popupSuffix={<NewEmployeeButton onClick={props.onAddClick} />}
      error={props.error}
      onChange={props.onChange}
    >
      <For each={sortedUsers()}>{(item) => <Option value={item.userId!}>{formatName(item)}</Option>}</For>
    </Select>
  );
}
