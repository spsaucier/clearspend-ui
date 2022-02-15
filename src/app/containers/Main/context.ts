import { createContext, useContext, Accessor } from 'solid-js';

import type { UserRolesAndPermissionsRecord, Business, User } from 'generated/capital';

interface InitContext {
  loggedInUser: Accessor<Readonly<User> | null>;
  business: Accessor<Readonly<Business> | null>;
  permissions: Accessor<Readonly<UserRolesAndPermissionsRecord> | null>;
  mutate: (
    data: [Readonly<Required<User>>, Readonly<Business>, Readonly<UserRolesAndPermissionsRecord>] | null,
  ) => void;
  refetch: () => Promise<unknown>;
}

interface ProvenContext extends InitContext {
  loggedInUser: Accessor<Readonly<Required<User>>>;
  business: Accessor<Readonly<Business>>;
  permissions: Accessor<Readonly<UserRolesAndPermissionsRecord>>;
}

export const BusinessContext = createContext<Readonly<InitContext>>();

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context || !context.business() || !context.loggedInUser() || !context.permissions())
    throw new ReferenceError('BusinessContext');

  return context as Readonly<ProvenContext>;
}
