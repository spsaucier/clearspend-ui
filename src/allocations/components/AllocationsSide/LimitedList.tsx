import { For } from 'solid-js';

import type { Allocation } from 'generated/capital';

import { Item } from './Item';
import { CHILD_PADDING_PX } from './constants';
import { getLevel } from './utils';

export interface LimitedListProps {
  currentID: string;
  items: readonly Readonly<Allocation>[];
  itemClass?: string;
  padding?: number;
  onSelect: (id: string) => void;
}

export function LimitedList(props: Readonly<LimitedListProps>) {
  return (
    <For each={props.items}>
      {(item) => (
        <Item
          data={item}
          active={props.currentID === item.allocationId}
          padding={getLevel(item, props.items) * CHILD_PADDING_PX + (props.padding || 0)}
          class={props.itemClass}
          onClick={props.onSelect}
        />
      )}
    </For>
  );
}
