import { createContext, useContext, Accessor } from 'solid-js';
import type * as LDClient from 'launchdarkly-js-client-sdk';

import type { Business, User, Allocation, UserRolesAndPermissionsRecord } from 'generated/capital';

type CurrentUser = Readonly<Required<User>>;
type Permissions = Readonly<UserRolesAndPermissionsRecord>;

export interface MutateContext {
  currentUser: CurrentUser;
  business: Business;
}

interface InitContext {
  currentUser: Accessor<CurrentUser | null>;
  business: Accessor<Readonly<Business> | null>;
  permissions: Accessor<Permissions | null>;
  allocations: Accessor<Allocation[]>;
  currentUserRoles: Accessor<Permissions[]>;
  mutate: (updates: Partial<Readonly<MutateContext>>) => void;
  reloadPermissions: () => Promise<void>;
  refetch: () => Promise<unknown>;
  ldClient: Accessor<LDClient.LDClient | null>;
}

interface OnboardingContext extends InitContext {
  currentUser: Accessor<CurrentUser>;
}

interface ProvenContext extends InitContext {
  currentUser: Accessor<CurrentUser>;
  business: Accessor<Readonly<Business>>;
  permissions: Accessor<Permissions>;
}

export const BusinessContext = createContext<Readonly<InitContext>>();

// NOTE: For onboarding only!
export function useOnboardingBusiness() {
  const context = useContext(BusinessContext);
  if (!context || !context.currentUser()) throw new ReferenceError('BusinessContext');
  return context as Readonly<OnboardingContext>;
}

// NOTE: For be used everywhere for logged-in user except onboarding
export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context || !context.business() || !context.permissions()) throw new ReferenceError('BusinessContext');
  return context as Readonly<ProvenContext>;
}
