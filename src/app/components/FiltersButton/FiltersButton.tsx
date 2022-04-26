import { Show, type JSXElement } from 'solid-js';
import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { Tag } from '_common/components/Tag';

import css from './FiltersButton.css';

interface FiltersButtonProps {
  count: number;
  label?: JSXElement;
  disabled?: boolean;
  onReset: () => void;
  onClick: () => void;
}

export function FiltersButton(props: Readonly<FiltersButtonProps>) {
  const onReset = (event: MouseEvent) => {
    event.stopPropagation();
    props.onReset();
  };

  return (
    <Button view="ghost" disabled={props.disabled} onClick={props.onClick} data-name="Filters">
      <span class={css.inner}>
        <span class={css.text}>
          <Show when={props.label} fallback={<Text message="Filters" />}>
            {props.label}
          </Show>
        </span>
        <Show when={Boolean(props.count)} fallback={<Icon name="filters" />}>
          <Tag size="xs" type="success" onClick={onReset}>
            <span class={css.count}>{props.count}</span>
            <Icon size="xs" name="cancel" />
          </Tag>
        </Show>
      </span>
    </Button>
  );
}
