import { Show } from 'solid-js';

import { join } from '_common/utils/join';
import { Icon } from '_common/components/Icon';
import type { Allocation } from 'generated/capital';

import css from './Item.css';

interface ItemProps {
  root?: boolean;
  data: Readonly<Allocation>;
  active?: boolean;
  class?: string;
  onClick: (id: string) => void;
}

export function Item(props: Readonly<ItemProps>) {
  return (
    <button
      class={join(css.item, props.class)}
      classList={{ [css.active!]: props.active }}
      onClick={() => props.onClick(props.data.allocationId)}
    >
      <Show when={props.root}>
        <Icon name="company" class={css.icon} />
      </Show>
      <span class={css.name}>{props.data.name}</span>
    </button>
  );
}
