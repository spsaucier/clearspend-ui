import type { Accessor } from 'solid-js';

import { isFunction } from './isFunction';

export function callValue<T extends unknown>(value: T | Accessor<T>): T {
  return isFunction(value) ? value() : value;
}
