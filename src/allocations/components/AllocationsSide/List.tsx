import { createMemo, createSignal, For, Show } from 'solid-js';

import type { Allocation } from 'generated/capital';

import { allocationWithID } from '../../utils/allocationWithID';

import { CHILD_PADDING_PX } from './constants';
import { getDefaultExpanded } from './utils';
import { Item } from './Item';

import css from './List.css';

export interface ListProps {
  currentID: string;
  parentID?: string;
  items: readonly Readonly<Allocation>[];
  padding?: number;
  itemClass?: string;
  onSelect: (id: string) => void;
}

export function List(props: Readonly<ListProps>) {
  const allocationIDsList = () => {
    return props.items.map((item) => item.allocationId);
  };

  const siblings = () => {
    if (props.parentID) {
      return props.items.filter((item) => item.parentAllocationId === props.parentID);
    } else {
      return props.items.filter((item) => allocationIDsList().indexOf(item.parentAllocationId!) === -1);
    }
  };

  const [expanded, setExpanded] = createSignal<Record<string, boolean>>(
    getDefaultExpanded(props.currentID, siblings(), props.items),
  );

  const onSwitch = (id: string) => {
    const current = expanded()[id];
    setExpanded((prev) => ({ ...prev, [id]: !current }));
  };

  return (
    <For each={siblings()}>
      {(item, idx) => {
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

        const isLastItem = createMemo(() => {
          return idx() === siblings().length - 1;
        });

        return (
          <div class={props.itemClass} classList={{ [css.withBorder!]: withBorder() && !isLastItem() }}>
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
