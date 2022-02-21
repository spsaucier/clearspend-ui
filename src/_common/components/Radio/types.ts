import type { JSXElement } from 'solid-js';

export interface RadioGroupProps {
  name: string;
  value?: string | boolean;
  class?: string;
  empty?: boolean;
  disabled?: boolean;
  children: JSXElement;
  onChange?: (value: string | boolean) => void;
}
