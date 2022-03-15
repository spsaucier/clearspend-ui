import { Text } from 'solid-i18n';
import { Show } from 'solid-js';

import { canManageUsers } from 'allocations/utils/permissions';
import { useBusiness } from 'app/containers/Main/context';
import { Icon } from '_common/components/Icon';

import css from './NewEmployeeButton.css';

interface NewEmployeeButtonProps {
  onClick: () => void;
}

export function NewEmployeeButton(props: Readonly<NewEmployeeButtonProps>) {
  const { permissions } = useBusiness();

  return (
    <Show when={canManageUsers(permissions())}>
      <button id="add-employee" class={css.button} onClick={props.onClick}>
        <Icon name="add-circle-outline" size="sm" class={css.icon} />
        <Text message="Add New Employee" />
      </button>
    </Show>
  );
}
