import { For } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { Select, Option } from '_common/components/Select';
import { Icon } from '_common/components/Icon';
import type { UserData } from 'generated/capital';
import { formatName } from 'employees/utils/formatName';

import css from './SelectEmployee.css';

interface SelectEmployeeProps {
  value: string;
  error?: boolean;
  users: readonly Readonly<UserData>[];
  onAddClick: () => void;
  onChange: (value: string) => void;
}

export function SelectEmployee(props: Readonly<SelectEmployeeProps>) {
  const i18n = useI18n();

  return (
    <Select
      name="employee"
      value={props.value}
      placeholder={String(i18n.t('Search by employee name'))}
      popupRender={(list) => (
        <>
          {list}
          <button id="add-employee" class={css.button} onClick={props.onAddClick}>
            <Icon name="add-circle-outline" size="sm" class={css.icon} />
            <Text message="Add New Employee" />
          </button>
        </>
      )}
      error={props.error}
      onChange={props.onChange}
    >
      <For each={props.users}>{(item) => <Option value={item.userId!}>{formatName(item)}</Option>}</For>
    </Select>
  );
}
