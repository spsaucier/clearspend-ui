import { createMemo, createSignal, For, Show } from 'solid-js';

import type { AccessibleAllocation } from 'allocations/types';

import { allocationWithID } from '../../utils/allocationWithID';

import { getDefaultExpanded } from './utils';
import { Item } from './Item';

import css from './List.css';

const CHILD_PADDING_PX = 16;

interface ListProps {
  currentID: string;
  parentID: string;
  items: readonly Readonly<AccessibleAllocation>[];
  padding?: number;
  itemClass?: string;
  onSelect: (id: string) => void;
}

export function List(props: Readonly<ListProps>) {
  const items = createMemo(() => props.items.filter((item) => item.parentAllocationId === props.parentID));

  const [expanded, setExpanded] = createSignal<Record<string, boolean>>(
    getDefaultExpanded(props.currentID, items(), props.items),
  );

  const onSwitch = (id: string) => {
    const current = expanded()[id];
    setExpanded((prev) => ({ ...prev, [id]: !current }));
  };

  return (
    <For each={items()}>
      {(item) => {
        const hasChildren = createMemo(() => Boolean(item.childrenAllocationIds?.length));
        const showSubmenu = createMemo(() => (hasChildren() && expanded()[item.allocationId]) || item.inaccessible);

        const withBorder = createMemo(() => {
          return showSubmenu() && !props.items.find(allocationWithID(item.parentAllocationId))?.parentAllocationId;
        });

        return (
          <div class={props.itemClass} classList={{ [css.withBorder!]: withBorder() }}>
            <Item
              data={item}
              active={props.currentID === item.allocationId}
              padding={props.padding}
              expanded={expanded()[item.allocationId] || item.inaccessible}
              hasChildren={hasChildren()}
              onClick={props.onSelect}
              onSwitch={onSwitch}
            />
            <Show when={showSubmenu()}>
              <List
                currentID={props.currentID}
                parentID={item.allocationId}
                items={props.items}
                padding={(props.padding || 0) + CHILD_PADDING_PX}
                itemClass={props.itemClass}
                onSelect={props.onSelect}
              />
            </Show>
          </div>
        );
      }}
    </For>
  );
}
