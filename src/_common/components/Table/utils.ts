import { isString } from '../../utils/isString';

import type { Sorter, Direction, TableColumn, OrderBy } from './types';

function changeDirection(value: Direction | undefined): Direction | undefined {
  if (!value) return 'ASC';
  if (value === 'ASC') return 'DESC';
  return undefined;
}

export function updateSorter(name: string, current: Sorter | undefined): Readonly<Sorter> {
  return { name, direction: changeDirection(current?.name === name ? current.direction : undefined) };
}

function toStr(keys: readonly string[] | undefined): string | undefined {
  return keys?.slice().sort().join(' ');
}

export function getInitSorter<T extends {}>(
  columns: readonly TableColumn<T>[],
  orderBy: readonly Partial<OrderBy>[] | undefined,
): Readonly<Sorter> | undefined {
  if (!orderBy?.length) return undefined;

  const keys = orderBy.map((item) => item.item).filter(isString);
  const direction = orderBy[0]!.direction;
  if (!keys.length || !direction) return undefined;

  const found = columns.find((column) => toStr(column.orderBy) === toStr(keys));
  return found && { name: found.name, direction };
}

export function getOrder(keys: readonly string[], direction: Direction | undefined): Readonly<OrderBy>[] | undefined {
  return direction ? keys.map((item) => ({ item, direction })) : undefined;
}
