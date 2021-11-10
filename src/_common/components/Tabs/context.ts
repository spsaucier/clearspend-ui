import { createContext, useContext } from 'solid-js';

import type { TabsProps } from './types';

export const TabsContext = createContext<Pick<TabsProps, 'value' | 'onChange'>>();

export function useTabsContext<T = string>() {
  const context = useContext(TabsContext);
  if (!context) throw new ReferenceError('TabsContext');
  return context as Pick<TabsProps<T>, 'value' | 'onChange'>;
}
