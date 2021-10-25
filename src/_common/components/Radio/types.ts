import type { JSXElement } from 'solid-js';

export interface RadioGroupProps {
  name: string;
  value?: string;
  class?: string;
  empty?: boolean;
  disabled?: boolean;
  children: JSXElement;
  onChange?: (value: string) => void;
}
