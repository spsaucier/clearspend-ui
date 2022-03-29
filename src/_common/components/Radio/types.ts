import type { JSXElement } from 'solid-js';

export type RadioValue = string | boolean;

export interface RadioProps<T> {
  value: T;
  class?: string;
  disabled?: boolean;
  children?: JSXElement;
}

export interface RadioGroupProps<T> {
  name: string;
  value?: T;
  class?: string;
  empty?: boolean;
  disabled?: boolean;
  children: JSXElement;
  onChange?: (value: T) => void;
}
