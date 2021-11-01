import { createContext, useContext } from 'solid-js';

import type { TabsProps } from './types';

export const TabsContext = createContext<Pick<TabsProps, 'value' | 'onChange'>>();

export function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) throw new ReferenceError('TabsContext');
  return context;
}
