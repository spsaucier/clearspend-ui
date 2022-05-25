import { createMemo, createSignal, For, Show } from 'solid-js';

import type { Allocation } from 'generated/capital';

import { allocationWithID } from '../../utils/allocationWithID';

import { CHILD_PADDING_PX } from './constants';
import { getDefaultExpanded } from './utils';
import { Item } from './Item';

import css from './List.css';

export interface ListProps {
  currentID: string;
  parentID: string;
  items: readonly Readonly<Allocation>[];
  padding?: number;
  itemClass?: string;
  onSelect: (id: string) => void;
}

export function List(props: Readonly<ListProps>) {
  const siblings = createMemo(() => props.items.filter((item) => item.parentAllocationId === props.parentID));

  const [expanded, setExpanded] = createSignal<Record<string, boolean>>(
    getDefaultExpanded(props.currentID, siblings(), props.items),
  );

  const onSwitch = (id: string) => {
    const current = expanded()[id];
    setExpanded((prev) => ({ ...prev, [id]: !current }));
  };

  return (
    <For each={siblings()}>
      {(item) => {
        const hasChildren = createMemo(() =>
          Boolean(
            item.childrenAllocationIds?.reduce<string[]>((acc, curr) => {
              if (props.items.some((i) => i.allocationId === curr)) acc.push(curr);
              return acc;
            }, []).length,
          ),
        );

        const showSubmenu = createMemo(() => hasChildren() && expanded()[item.allocationId]);

        const withBorder = createMemo(() => {
          return showSubmenu() && !props.items.find(allocationWithID(item.parentAllocationId))?.parentAllocationId;
        });

        return (
          <div class={props.itemClass} classList={{ [css.withBorder!]: withBorder() }}>
            <Item
              data={item}
              active={props.currentID === item.allocationId}
              padding={props.padding}
              expanded={expanded()[item.allocationId]}
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
