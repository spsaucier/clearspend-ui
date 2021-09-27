import { splitProps } from 'solid-js';

import { join } from '../../utils/join';

import { GroupContext } from './context';
import type { CheckboxGroupProps } from './types';

export function CheckboxGroup(props: Readonly<CheckboxGroupProps>) {
  const [local, others] = splitProps(props, ['children']);

  return (
    <div class={join(props.class)}>
      <GroupContext.Provider value={others}>{local.children}</GroupContext.Provider>
    </div>
  );
}
