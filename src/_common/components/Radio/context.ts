import { createContext, useContext } from 'solid-js';

import type { RadioGroupProps } from './types';

export const GroupContext = createContext<Omit<RadioGroupProps, 'class' | 'children'>>();

export function useGroupContext() {
  const context = useContext(GroupContext);
  if (!context) throw new Error();

  return context;
}
