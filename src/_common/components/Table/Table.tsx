import { createSignal, createMemo, For, Show } from 'solid-js';

import { join } from '../../utils/join';

import { Sorter } from './Sorter';
import { updateSorter, getInitSorter, getOrder } from './utils';
import type { TableColumn, OrderBy } from './types';

import css from './Table.css';

export interface TableProps<T extends {}> {
  columns: readonly Readonly<TableColumn<T>>[];
  data: readonly T[];
  order?: readonly Partial<OrderBy>[];
  class?: string;
  cellClass?: string;
  idProp?: KeysOfType<Required<T>, string>;
  selectedIds?: string[];
  onRowClick?: (data: T) => void;
  onChangeOrder?: (value: Readonly<OrderBy>[] | undefined) => void;
  darkMode?: boolean;
}

export function Table<T extends {}>(props: Readonly<TableProps<T>>) {
  const [sorter, setSorter] = createSignal(getInitSorter(props.columns, props.order));

  const onChangeSorter = (column: Readonly<TableColumn<T>>) => {
    if (!column.orderBy?.length) return;
    const updated = updateSorter(column.name, sorter());
    setSorter(updated);
    props.onChangeOrder?.(getOrder(column.orderBy, updated.direction));
  };

  return (
    <table class={join(css.root, props.class, props.darkMode && css.dark)}>
      <thead class={css.head}>
        <tr>
          <For each={props.columns}>
            {(column) => {
              const sortable = createMemo(() => Boolean(column.orderBy?.length));
              return (
                <th
                  class={join(css.th)}
                  classList={{ [css.hasSorter!]: sortable() }}
                  onClick={() => onChangeSorter(column)}
                >
                  <span class={css.title}>
                    {column.title}
                    <Show when={sortable()}>
                      <Sorter
                        value={sorter()?.name === column.name ? sorter()?.direction : undefined}
                        class={css.sorter}
                      />
                    </Show>
                  </span>
                </th>
              );
            }}
          </For>
        </tr>
      </thead>
      <tbody>
        <For each={props.data}>
          {(row: T) => (
            <tr
              class={join(
                css.row,
                props.onRowClick && css.interactive,
                props.idProp && props.selectedIds?.includes(row[props.idProp] as unknown as string) && css.selected,
              )}
              onClick={() => props.onRowClick?.(row)}
            >
              <For each={props.columns}>
                {(column) => {
                  return (
                    <td class={join(css.td, props.cellClass, column.class)} onClick={() => column.onClick?.(row)}>
                      {typeof column.render === 'function'
                        ? column.render(row)
                        : // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
                          (row as any)[column.name]}
                    </td>
                  );
                }}
              </For>
            </tr>
          )}
        </For>
      </tbody>
    </table>
  );
}
