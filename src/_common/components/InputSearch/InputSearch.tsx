import { createSignal, createEffect, onCleanup, untrack } from 'solid-js';

import { Input } from '../Input';
import type { InputProps } from '../Input';
import { Icon } from '../Icon';

export interface InputSearchProps extends Omit<InputProps, 'suffix' | 'onChange'> {
  delay?: number;
  onSearch: (value: string) => void;
}

export function InputSearch(props: Readonly<InputSearchProps>) {
  let timer: number;
  const [search, setSearch] = createSignal(props.value || '');

  const onChange = (value: string) => {
    clearTimeout(timer);
    setSearch(value);
    timer = setTimeout(() => props.onSearch(value), props.delay || 0);
  };

  createEffect(() => {
    if (props.value !== untrack(search)) setSearch(props.value || '');
  });

  onCleanup(() => clearTimeout(timer));

  return <Input {...props} value={search()} suffix={<Icon name="search" size="sm" />} onChange={onChange} />;
}
