import type { JSXElement } from 'solid-js';

export function getOptions(elements: JSXElement): readonly HTMLElement[] {
  const items = typeof elements === 'function' ? elements() : elements;
  return Array.isArray(items) ? items.filter((el): el is HTMLElement => el instanceof HTMLElement) : [];
}

export function isMatch(search: string) {
  return (el: HTMLElement) =>
    el.dataset.value?.toLowerCase().includes(search) || el.innerText.toLowerCase().includes(search);
}

export function getSelected(value: string, elements: JSXElement): string | undefined {
  return getOptions(elements).find((el) => el.dataset.value === value)?.innerText;
}
