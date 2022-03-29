import { splitProps } from 'solid-js';

import { join } from '../../utils/join';

import { GroupContext } from './context';
import type { RadioValue, RadioGroupProps } from './types';

import css from './RadioGroup.css';

export function RadioGroup<T extends RadioValue>(props: Readonly<RadioGroupProps<T>>) {
  const [local, others] = splitProps(props, ['class', 'children']);

  return (
    <div class={join(css.root, local.class)}>
      <GroupContext.Provider value={others}>{local.children}</GroupContext.Provider>
    </div>
  );
}
