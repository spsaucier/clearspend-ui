import { Show, JSXElement } from 'solid-js';
import { NavLink } from 'solid-app-router';

import { join } from '_common/utils/join';
import { Icon } from '_common/components/Icon';
import { Button } from '_common/components/Button';
import type { AccessibleAllocation } from 'allocations/types';

import css from './Item.css';

interface ItemProps {
  root?: boolean;
  data: Readonly<AccessibleAllocation>;
  active?: boolean;
  padding?: number;
  expanded?: boolean;
  hasChildren?: boolean;
  title?: JSXElement;
  class?: string;
  onClick: (id: string) => void;
  onSwitch?: (id: string) => void;
}

export function Item(props: Readonly<ItemProps>) {
  const Title = () => (
    <>
      <Show when={props.root}>
        <Icon name="company" class={css.icon} />
      </Show>
      <span class={css.name}>{props.title ?? props.data.name}</span>
    </>
  );

  return (
    <div
      class={join(css.root, props.class)}
      classList={{
        [css.small!]: Boolean(props.padding),
        [css.active!]: props.active,
        [css.expanded!]: props.expanded,
        [css.inaccessible!]: props.data.inaccessible,
      }}
      style={{ 'padding-left': `${props.padding || 0}px` }}
    >
      <Show
        when={!props.data.inaccessible}
        fallback={
          <div class={css.item}>
            <Title />
          </div>
        }
      >
        <NavLink
          href={`/allocations/${props.data.allocationId}`}
          class={css.item}
          onClick={() => props.onClick(props.data.allocationId)}
        >
          <Title />
        </NavLink>
      </Show>
      <Show when={props.hasChildren && !props.data.inaccessible}>
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
