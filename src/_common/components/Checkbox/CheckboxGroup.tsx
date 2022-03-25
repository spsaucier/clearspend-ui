import { splitProps } from 'solid-js';

import { join } from '../../utils/join';

import { GroupContext } from './context';
import type { CheckboxValue, CheckboxGroupProps } from './types';

import css from './CheckboxGroup.css';

export function CheckboxGroup<T extends CheckboxValue>(props: Readonly<CheckboxGroupProps<T>>) {
  const [local, others] = splitProps(props, ['class', 'children']);

  return (
    <div class={join(css.root, local.class)}>
      <GroupContext.Provider value={others}>{local.children}</GroupContext.Provider>
    </div>
  );
}
