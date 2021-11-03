import { splitProps } from 'solid-js';

import { join } from '../../utils/join';

import { TabsContext } from './context';
import type { TabsProps } from './types';

import css from './TabList.css';

export function TabList(props: Readonly<TabsProps>) {
  const [context, local] = splitProps(props, ['value', 'onChange']);

  return (
    <div class={join(css.root, local.class)}>
      <div class={css.wrapper}>
        <TabsContext.Provider value={context}>{local.children}</TabsContext.Provider>
      </div>
    </div>
  );
}
