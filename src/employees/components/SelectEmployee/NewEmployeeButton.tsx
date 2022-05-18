import { Text } from 'solid-i18n';
import { Show } from 'solid-js';

import { AddButton } from '_common/components/Select';
import { useBusiness } from 'app/containers/Main/context';
import { canManageUsers } from 'allocations/utils/permissions';

interface NewEmployeeButtonProps {
  onClick: () => void;
}

export function NewEmployeeButton(props: Readonly<NewEmployeeButtonProps>) {
  const { permissions } = useBusiness();

  return (
    <Show when={canManageUsers(permissions())}>
      <AddButton id="add-employee" onClick={props.onClick}>
        <Text message="Add New Employee" />
      </AddButton>
    </Show>
  );
}
