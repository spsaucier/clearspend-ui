import type { JSXElement } from 'solid-js';

export interface TabsProps {
  value?: string;
  class?: string;
  children: JSXElement;
  onChange?: (value: string) => void;
}
