import { Show } from 'solid-js';

import { Tooltip } from '_common/components/Tooltip';
import { Icon } from '_common/components/Icon';

import type { Allocation } from '../../types';

import css from './Item.css';

interface ItemProps {
  root?: boolean;
  data: Readonly<Allocation>;
  active?: boolean;
  onClick: (id: Allocation['allocationId']) => void;
}

export function Item(props: Readonly<ItemProps>) {
  return (
    <Tooltip message={props.data.name}>
      {(ttProps) => (
        <button
          class={css.item}
          classList={{ [css.active!]: props.active }}
          onClick={() => props.onClick(props.data.allocationId)}
          {...ttProps}
        >
          <Show when={props.root}>
            <Icon name="company" class={css.icon} />
          </Show>
          <span class={css.name}>{props.data.name}</span>
          {/*
          <Show when={!props.root && props.data.childrenAllocationIds.length}>
            <Icon name="chevron-down" />
          </Show>
          */}
        </button>
      )}
    </Tooltip>
  );
}
