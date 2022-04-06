import { onMount, onCleanup, type Accessor } from 'solid-js';
import { nanoid } from 'nanoid';

import { useDeferEffect } from './useDeferEffect';

const stack = new Set();

export function useDisableBodyScroll(disabled: Accessor<boolean>) {
  const id = nanoid();
  const body = document.body;

  const disable = () => {
    if (!stack.size) {
      const width = body.clientWidth;
      body.style.overflow = 'hidden';
      body.style.width = `${width}px`;
    }
    stack.add(id);
  };

  const enable = () => {
    stack.delete(id);
    if (!stack.size) {
      body.style.overflow = '';
      body.style.width = '';
    }
  };

  onMount(() => disabled() && disable());
  useDeferEffect((val) => (val ? disable() : enable()), disabled);
  onCleanup(() => enable());
}
