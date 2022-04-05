import { createMemo, For } from 'solid-js';

import type { Allocation } from 'generated/capital';

import { getParentsChain } from '../../utils/getParentsChain';

import css from './Breadcrumbs.css';

interface BreadcrumbsProps {
  current: Readonly<Allocation>;
  items: readonly Readonly<Allocation>[];
}

export function Breadcrumbs(props: Readonly<BreadcrumbsProps>) {
  const parents = createMemo(() => getParentsChain(props.items, props.current));

  return (
    <span>
      <For each={parents()}>{(item) => <span class={css.parent}>{item.name}</span>}</For>
      <span class={css.current}>{props.current.name}</span>
    </span>
  );
}
