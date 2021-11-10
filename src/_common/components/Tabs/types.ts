import type { JSXElement } from 'solid-js';

export interface TabsProps<T = string> {
  value?: T;
  class?: string;
  children: JSXElement;
  onChange?: (value: T) => void;
}
