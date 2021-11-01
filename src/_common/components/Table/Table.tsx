import { JSXElement, For } from 'solid-js';

import { join } from '../../utils/join';

import css from './Table.css';

export interface TableColumn<T extends {}> {
  name: string;
  title?: string;
  class?: string;
  render?: (row: T) => JSXElement;
}

export interface TableProps<T extends {}> {
  columns: readonly Readonly<TableColumn<T>>[];
  data: readonly T[];
  class?: string;
  tdClass?: string;
}

export function Table<T extends {}>(props: Readonly<TableProps<T>>) {
  return (
    <table class={join(css.root, props.class)}>
      <thead class={css.head}>
        <tr>
          <For each={props.columns}>{(column) => <th class={join(css.th, column.class)}>{column.title}</th>}</For>
        </tr>
      </thead>
      <tbody>
        <For each={props.data}>
          {(row: T) => (
            <tr>
              <For each={props.columns}>
                {(column) => {
                  return (
                    <td class={join(css.td, props.tdClass, column.class)}>
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
