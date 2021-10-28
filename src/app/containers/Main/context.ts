import { createContext, useContext, Resource } from 'solid-js';

import type { Businesses } from '../../types/businesses';

interface IBusinessContext {
  business: Resource<Readonly<Businesses>>;
  refetch: () => void;
}

export const BusinessContext = createContext<Readonly<IBusinessContext>>();

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) throw new Error('BusinessContext');

  return context;
}
