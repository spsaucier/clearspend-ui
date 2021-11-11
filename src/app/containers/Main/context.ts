import { createContext, useContext, Accessor } from 'solid-js';

import type { User } from 'employees/types';

import type { Businesses } from '../../types/businesses';

interface InitContext {
  owner: Accessor<Readonly<User>>;
  business: Accessor<Readonly<Businesses> | null>;
  mutate: (business: [Readonly<User>, Readonly<Businesses>] | null) => void;
  refetch: () => Promise<unknown>;
}

interface ProvenContext extends InitContext {
  owner: Accessor<Readonly<User>>;
  business: Accessor<Readonly<Businesses>>;
}

export const BusinessContext = createContext<Readonly<InitContext>>();

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context || !context.business()) throw new ReferenceError('BusinessContext');

  return context as Readonly<ProvenContext>;
}
