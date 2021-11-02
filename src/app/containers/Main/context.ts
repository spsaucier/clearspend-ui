import { createContext, useContext, Accessor } from 'solid-js';

import type { Businesses } from '../../types/businesses';

interface IBusinessContext {
  business: Accessor<Readonly<Businesses> | null>;
  mutate: (business: Readonly<Businesses> | null) => void;
  refetch: () => Promise<unknown>;
}

export const BusinessContext = createContext<Readonly<IBusinessContext>>();

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context || !context.business()) throw new ReferenceError('BusinessContext');
  return context as Readonly<Omit<IBusinessContext, 'business'> & { business: Accessor<Readonly<Businesses>> }>;
}
