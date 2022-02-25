import type { JSXElement } from 'solid-js';

import { callValue } from '../../utils/callValue';

export function getOptions(elements: JSXElement): readonly HTMLElement[] {
  const items = callValue(elements);
  if (!Array.isArray(items)) return [];

  return items.reduce<HTMLElement[]>((all, item) => {
    let el = typeof item === 'function' ? item() : item;
    if (!Array.isArray(el)) el = [el];

    el.forEach((child) => {
      if (child instanceof HTMLElement) all.push(child);
    });

    return all;
  }, []);
}

export function isMatch(search: string) {
  return (el: HTMLElement) =>
    el.dataset.value?.toLowerCase().includes(search) || el.innerText.toLowerCase().includes(search);
}

export function getSelected(value: string, elements: JSXElement): string | undefined {
  return getOptions(elements).find((el) => el.dataset.value === value)?.innerText || value;
}
