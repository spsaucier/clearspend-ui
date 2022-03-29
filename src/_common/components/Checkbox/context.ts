import { createContext } from 'solid-js';

import type { CheckboxGroupProps } from './types';

export type ContextType<T> = Omit<CheckboxGroupProps<T>, 'class' | 'children'>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const GroupContext = createContext<ContextType<any>>({});
