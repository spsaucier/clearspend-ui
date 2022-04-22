import type { JSXElement } from 'solid-js';

export type Direction = 'ASC' | 'DESC';

export interface OrderBy {
  item: string;
  direction: Direction;
}

export interface TableColumn<T extends {}> {
  name: string;
  title?: JSXElement;
  orderBy?: readonly string[];
  class?: string;
  render?: (row: T) => JSXElement;
  onClick?: (row: T) => void;
}

export interface Sorter {
  name: string;
  direction: Direction | undefined;
}
