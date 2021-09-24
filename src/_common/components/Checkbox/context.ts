import { createContext } from 'solid-js';

import type { CheckboxGroupProps } from './types';

export const GroupContext = createContext<Omit<CheckboxGroupProps, 'children'>>({});
