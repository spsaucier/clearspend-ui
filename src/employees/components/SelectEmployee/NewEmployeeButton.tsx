import { Text } from 'solid-i18n';

import { Icon } from '_common/components/Icon';

import css from './NewEmployeeButton.css';

interface NewEmployeeButtonProps {
  onClick: () => void;
}

export function NewEmployeeButton(props: Readonly<NewEmployeeButtonProps>) {
  return (
    <button id="add-employee" class={css.button} onClick={props.onClick}>
      <Icon name="add-circle-outline" size="sm" class={css.icon} />
      <Text message="Add New Employee" />
    </button>
  );
}
