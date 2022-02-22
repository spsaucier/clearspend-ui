import { createContext, useContext, Accessor } from 'solid-js';

import type { Business, User, UserRolesAndPermissionsRecord } from 'generated/capital';

type SignupUser = Readonly<Required<User>>;
type Permissions = Readonly<UserRolesAndPermissionsRecord>;

interface InitContext {
  signupUser: Accessor<SignupUser | null>;
  business: Accessor<Readonly<Business> | null>;
  permissions: Accessor<Permissions | null>;
  mutate: (business: [SignupUser, Readonly<Business>, Permissions | null] | null) => void;
  refetch: () => Promise<unknown>;
}

interface OnboardingContext extends InitContext {
  signupUser: Accessor<SignupUser>;
}

interface ProvenContext extends InitContext {
  signupUser: Accessor<SignupUser>;
  business: Accessor<Readonly<Business>>;
  permissions: Accessor<Permissions>;
}

export const BusinessContext = createContext<Readonly<InitContext>>();

// NOTE: For onboarding only!
export function useOnboardingBusiness() {
  const context = useContext(BusinessContext);
  if (!context || !context.signupUser()) throw new ReferenceError('BusinessContext');
  return context as Readonly<OnboardingContext>;
}

// NOTE: For be used everywhere for logged-in user except onboarding
export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context || !context.business() || !context.permissions()) throw new ReferenceError('BusinessContext');
  return context as Readonly<ProvenContext>;
}
