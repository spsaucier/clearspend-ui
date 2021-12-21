import { Text } from 'solid-i18n';

import { join } from '_common/utils/join';
import { Button } from '_common/components/Button';

import css from './ResetLimits.css';

interface ResetLimitsProps {
  disabled: boolean;
  class?: string;
  onClick: () => void;
}

export function ResetLimits(props: Readonly<ResetLimitsProps>) {
  return (
    <div class={join(css.root, props.class)}>
      <h4 class={css.title}>
        <Text message="Reset Spend Controls" />
      </h4>
      <Text message="Reset spend controls to default allocation settings" class={css.message!} />
      <Button wide type="danger" view="second" disabled={props.disabled} onClick={props.onClick}>
        <Text message="Reset to defaults" />
      </Button>
    </div>
  );
}
