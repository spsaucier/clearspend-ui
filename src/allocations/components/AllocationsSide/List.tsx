import { createMemo, For, Show } from 'solid-js';

import type { Allocation } from 'generated/capital';

import { Item } from './Item';

import css from './List.css';

interface ListProps {
  currentID: Allocation['allocationId'];
  parentID: Allocation['allocationId'];
  items: readonly Readonly<Allocation>[];
  onSelect: (id: Allocation['allocationId']) => void;
}

export function List(props: Readonly<ListProps>) {
  const items = createMemo(() => props.items.filter((item) => item.parentAllocationId === props.parentID));

  return (
    <For each={items()}>
      {(item) => (
        <div>
          <Item data={item} active={props.currentID === item.allocationId} onClick={props.onSelect} />
          <Show when={item.childrenAllocationIds?.length}>
            <div class={css.children}>
              <List
                currentID={props.currentID}
                parentID={item.allocationId}
                items={props.items}
                onSelect={props.onSelect}
              />
            </div>
          </Show>
        </div>
      )}
    </For>
  );
}
