import { onCleanup } from 'solid-js';

import { Input } from '../Input';
import type { InputProps } from '../Input';
import { Icon } from '../Icon';

interface InputSearchProps extends Omit<InputProps, 'suffix' | 'onChange'> {
  delay?: number;
  onSearch: (value: string) => void;
}

export function InputSearch(props: Readonly<InputSearchProps>) {
  let timer: number;

  const onChange = (value: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => props.onSearch(value), props.delay || 0);
  };

  onCleanup(() => clearTimeout(timer));

  return <Input {...props} suffix={<Icon name="search" size="sm" />} onChange={onChange} />;
}
