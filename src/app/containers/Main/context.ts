import { createContext, useContext, Accessor } from 'solid-js';

import type { Businesses } from '../../types/businesses';

interface IBusinessContext {
  business: Accessor<Readonly<Businesses>>;
  // mutate: (business: Readonly<Businesses> | null) => void;
  refetch: () => Promise<unknown>;
}

export const BusinessContext = createContext<Readonly<IBusinessContext>>();

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) throw new ReferenceError('BusinessContext');

  return context;
}
