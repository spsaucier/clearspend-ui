import { createContext, useContext, Accessor } from 'solid-js';

import type { Business, User } from 'generated/capital';

interface InitContext {
  owner: Accessor<Readonly<Required<User>>>;
  business: Accessor<Readonly<Business> | null>;
  mutate: (business: [Readonly<Required<User>>, Readonly<Business>] | null) => void;
  refetch: () => Promise<unknown>;
}

interface ProvenContext extends InitContext {
  owner: Accessor<Readonly<Required<User>>>;
  business: Accessor<Readonly<Business>>;
}

export const BusinessContext = createContext<Readonly<InitContext>>();

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context || !context.business()) throw new ReferenceError('BusinessContext');

  return context as Readonly<ProvenContext>;
}
