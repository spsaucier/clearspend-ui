import { createMemo, Show } from 'solid-js';
import { NavLink } from 'solid-app-router';

import { Icon } from '_common/components/Icon';
import { Button } from '_common/components/Button';
import type { Allocation } from 'generated/capital';

import css from './Item.css';

interface ItemProps {
  data: Readonly<Allocation>;
  active?: boolean;
  padding?: number;
  expanded?: boolean;
  hasChildren?: boolean;
  class?: string;
  onClick: (id: string) => void;
  onSwitch?: (id: string) => void;
}

export function Item(props: Readonly<ItemProps>) {
  const isRoot = createMemo(() => !props.data.parentAllocationId);

  return (
    <div
      class={css.root}
      classList={{
        [props.class!]: !!props.class,
        [css.isRoot!]: isRoot(),
        [css.small!]: Boolean(props.padding),
        [css.active!]: props.active,
        [css.expanded!]: props.expanded,
      }}
      style={{ 'padding-left': `${props.padding || 0}px` }}
    >
      <NavLink
        href={`/allocations/${props.data.allocationId}`}
        class={css.item}
        onClick={() => props.onClick(props.data.allocationId)}
      >
        <Show when={isRoot()}>
          <Icon name="company" class={css.icon} />
        </Show>
        <span class={css.name}>{props.data.name}</span>
      </NavLink>
      <Show when={props.hasChildren}>
        <Button
          view="ghost"
          icon={{ pos: 'left', name: 'chevron-right', class: css.moreIcon }}
          class={css.more}
          onClick={() => props.onSwitch?.(props.data.allocationId)}
        />
      </Show>
    </div>
  );
}
