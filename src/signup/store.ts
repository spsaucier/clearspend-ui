import { createStore } from 'solid-js/store';

import type { BusinessType, BusinessTypeCategory } from 'app/types/businesses';
import { RelationshipToBusiness } from 'app/types/businesses';
import { storage } from '_common/api/storage';

const STORAGE_KEY = 'signup';

interface SignupStore {
  first?: string;
  last?: string;
  email?: string;
  emailVerified?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  businessTypeCategory?: BusinessTypeCategory;
  businessType?: BusinessType;
  relationshipToBusiness?: Readonly<RelationshipToBusiness[]>;
  pid?: string;
}

function init(): SignupStore {
  return {
    ...storage.get<SignupStore>(STORAGE_KEY),
  };
}

export function useSignup() {
  const [store, setStore] = createStore<SignupStore>(init());

  const update = (data: Partial<SignupStore>) => {
    setStore((state) => {
      const updated = { ...state, ...data };
      storage.set(STORAGE_KEY, updated);
      return updated;
    });
  };

  const resetStore = () => {
    storage.set(STORAGE_KEY, {});
  };

  return {
    store,
    setName: (first: string, last: string) => update({ first, last }),
    setBusinessTypeCategory: (businessTypeCategory: BusinessTypeCategory) => update({ businessTypeCategory }),
    setBusinessType: (businessType: BusinessType) => update({ businessType }),
    setRelationshipToBusiness: (relationshipToBusiness: Readonly<RelationshipToBusiness[]>) =>
      update({ relationshipToBusiness }),
    setEmail: (email: string, pid: string) => update({ email, pid }),
    setTel: (phone: string) => update({ phone }),
    setPhoneVerified: (phoneVerified: boolean) => update({ phoneVerified }),
    setEmailVerified: (emailVerified: boolean) => update({ emailVerified }),
    cleanup: () => {
      storage.remove(STORAGE_KEY);
      setStore({});
    },
    resetStore,
  };
}

export enum Step {
  AccountSetUpStep,
  EmailOtpStep, // TODO: move to after AccountSetUpStep when backend is ready
  BusinessTypeCategoryStep, // now contains BusinessTypeStep and RelationshipToBusinessStep, todo: rename
  PhoneStep,
  PhoneOtpStep,
  PasswordStep,
  SorryButStep,
}

export function getInitStep(store: SignupStore): Step {
  const {
    first,
    last,
    businessTypeCategory,
    businessType,
    relationshipToBusiness,
    phone,
    email,
    emailVerified,
    phoneVerified,
  } = store;
  switch (true) {
    case !first || !last || !email:
      return Step.AccountSetUpStep;
    case !emailVerified:
      return Step.EmailOtpStep;
    case !businessTypeCategory || !businessType || !relationshipToBusiness:
      return Step.BusinessTypeCategoryStep;
    case relationshipToBusiness?.includes(RelationshipToBusiness.OTHER) && relationshipToBusiness.length === 1:
      return Step.SorryButStep;
    case !phone:
      return Step.PhoneStep;
    case !phoneVerified:
      return Step.PhoneOtpStep;
    default:
      return Step.PasswordStep;
  }
}
