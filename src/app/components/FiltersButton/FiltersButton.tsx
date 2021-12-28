import { Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';
import { Icon } from '_common/components/Icon';
import { Tag } from '_common/components/Tag';

import css from './FiltersButton.css';

interface FiltersButtonProps {
  count: number;
  onReset: () => void;
  onClick: () => void;
}

export function FiltersButton(props: Readonly<FiltersButtonProps>) {
  const onReset = (event: MouseEvent) => {
    event.stopPropagation();
    props.onReset();
  };

  return (
    <Button view="ghost" onClick={props.onClick}>
      <span class={css.inner}>
        <Text message="Filters" class={css.text!} />
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
