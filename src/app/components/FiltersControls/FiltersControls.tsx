import { Text } from 'solid-i18n';

import { join } from '_common/utils/join';
import { Button } from '_common/components/Button';

import css from './FiltersControls.css';

interface FiltersControlsProps {
  class?: string;
  onReset: () => void;
  onConfirm: () => void;
}

export function FiltersControls(props: Readonly<FiltersControlsProps>) {
  return (
    <div class={join(css.root, props.class)}>
      <Button view="ghost" onClick={props.onReset} data-name="Reset filters">
        <Text message="Reset" />
      </Button>
      <Button
        type="primary"
        htmlType="submit"
        class={css.confirm}
        onClick={props.onConfirm}
        data-name="Confirm filters"
      >
        <Text message="Confirm" />
      </Button>
    </div>
  );
}
