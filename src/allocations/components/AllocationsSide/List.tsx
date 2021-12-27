import { createMemo, createSignal, For, Show } from 'solid-js';

import { Button } from '_common/components/Button';
import type { Allocation } from 'generated/capital';

import { allocationWithID } from '../../utils/allocationWithID';

import { getDefaultExpanded } from './utils';
import { Item } from './Item';

import css from './List.css';

interface ListProps {
  currentID: string;
  parentID: string;
  items: readonly Readonly<Allocation>[];
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
        const showSubmenu = createMemo(() => hasChildren() && expanded()[item.allocationId]);

        const withBorder = createMemo(() => {
          return showSubmenu() && !props.items.find(allocationWithID(item.parentAllocationId))?.parentAllocationId;
        });

        return (
          <div class={props.itemClass} classList={{ [css.withBorder!]: withBorder() }}>
            <div class={css.itemWrapper} data-expanded={expanded()[item.allocationId]}>
              <Item data={item} active={props.currentID === item.allocationId} onClick={props.onSelect} />
              <Show when={hasChildren()}>
                <Button
                  view="ghost"
                  icon={{ pos: 'left', name: 'chevron-right', class: css.moreIcon }}
                  class={css.more}
                  onClick={() => onSwitch(item.allocationId)}
                />
              </Show>
            </div>
            <Show when={showSubmenu()}>
              <div class={css.children}>
                <List
                  currentID={props.currentID}
                  parentID={item.allocationId}
                  items={props.items}
                  itemClass={props.itemClass}
                  onSelect={props.onSelect}
                />
              </div>
            </Show>
          </div>
        );
      }}
    </For>
  );
}
