import { createContext, useContext } from 'solid-js';

import type { RadioGroupProps } from './types';

export type ContextType<T> = Omit<RadioGroupProps<T>, 'class' | 'children'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GroupContext = createContext<ContextType<any>>();

export function useGroupContext<T>() {
  const context = useContext<ContextType<T> | undefined>(GroupContext);
  if (!context) throw new ReferenceError('GroupContext');

  return context;
}
