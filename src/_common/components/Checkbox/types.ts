import type { JSXElement } from 'solid-js';

export type CheckboxValue = string;

export interface CheckboxGroupProps<T> {
  name?: string;
  value?: T[];
  class?: string;
  empty?: boolean;
  disabled?: boolean;
  children: JSXElement;
  onChange?: (value: T[]) => void;
}

export interface CheckboxProps<T> {
  value?: T;
  checked?: boolean;
  indeterminate?: boolean;
  class?: string;
  disabled?: boolean;
  children?: JSXElement;
  onChange?: (checked: boolean) => void;
  darkMode?: boolean;
}
