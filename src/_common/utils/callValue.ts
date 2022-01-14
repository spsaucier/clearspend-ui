import type { Accessor } from 'solid-js';

export function callValue<T extends unknown>(value: T | Accessor<T>): T {
  return typeof value === 'function' ? (value as () => T)() : value;
}
