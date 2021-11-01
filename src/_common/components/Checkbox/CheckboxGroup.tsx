import { splitProps } from 'solid-js';

import { join } from '../../utils/join';

import { GroupContext } from './context';
import type { CheckboxGroupProps } from './types';

import css from './CheckboxGroup.css';

export function CheckboxGroup(props: Readonly<CheckboxGroupProps>) {
  const [local, others] = splitProps(props, ['children']);

  return (
    <div class={join(css.root, props.class)}>
      <GroupContext.Provider value={others}>{local.children}</GroupContext.Provider>
    </div>
  );
}
