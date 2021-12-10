import { createMemo, Show } from 'solid-js';

import type { Allocation } from 'generated/capital';

import { allocationWithID } from '../../utils/allocationWithID';

import css from './Breadcrumbs.css';

interface BreadcrumbsProps {
  current: Readonly<Allocation>;
  items: readonly Readonly<Allocation>[];
}

export function Breadcrumbs(props: Readonly<BreadcrumbsProps>) {
  const parent = createMemo(() => {
    const id = props.current.parentAllocationId;
    return id && props.items.find(allocationWithID(id));
  });

  return (
    <span>
      <Show when={parent()}>{(item) => <span class={css.parent}>{item.name}</span>}</Show>
      <span class={css.current}>{props.current.name}</span>
    </span>
  );
}
