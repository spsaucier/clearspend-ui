import { JSXElement, For } from 'solid-js';

import { join } from '../../utils/join';

import css from './Table.css';

export interface TableColumn<T extends {}> {
  name: string;
  title?: JSXElement;
  class?: string;
  render?: (row: T) => JSXElement;
  onClick?: (row: T) => void;
}

export interface TableProps<T extends {}> {
  columns: readonly Readonly<TableColumn<T>>[];
  data: readonly T[];
  class?: string;
  tdClass?: string;
  onRowClick?: (data: T) => void;
}

export function Table<T extends {}>(props: Readonly<TableProps<T>>) {
  return (
    <table class={join(css.root, props.class)}>
      <thead class={css.head}>
        <tr>
          <For each={props.columns}>{(column) => <th class={join(css.th)}>{column.title}</th>}</For>
        </tr>
      </thead>
      <tbody>
        <For each={props.data}>
          {(row: T) => (
            <tr class={css.row} onClick={() => props.onRowClick?.(row)}>
              <For each={props.columns}>
                {(column) => {
                  return (
                    <td class={join(css.td, props.tdClass, column.class)} onClick={() => column.onClick?.(row)}>
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
