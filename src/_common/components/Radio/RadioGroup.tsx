import { splitProps } from 'solid-js';

import { join } from '../../utils/join';

import { GroupContext } from './context';
import type { RadioGroupProps } from './types';

import css from './RadioGroup.css';

export function RadioGroup<T>(props: Readonly<RadioGroupProps<T>>) {
  const [local, others] = splitProps(props, ['class', 'children']);

  return (
    <div class={join(css.root, local.class)}>
      <GroupContext.Provider value={others}>{local.children}</GroupContext.Provider>
    </div>
  );
}
