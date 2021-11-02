import { createStore } from 'solid-js/store';

import { storage } from '_common/api/storage';
import type { UUIDString } from 'app/types/common';

const STORAGE_KEY = 'signup';

export interface SignupStore {
  first?: string;
  last?: string;
  email?: string;
  phone?: string;
  pid?: UUIDString;
}

function init(): SignupStore {
  const value = storage.get<SignupStore>(STORAGE_KEY);
  return {
    first: value?.first,
    last: value?.last,
    email: value?.email,
    phone: value?.phone,
    pid: value?.pid,
  };
}

export function useSignup() {
  const [store, setStore] = createStore<SignupStore>(init());

  function update(data: Partial<SignupStore>) {
    setStore((state) => {
      const updated = { ...state, ...data };
      storage.set(STORAGE_KEY, updated);
      return updated;
    });
  }

  return {
    store,
    setName: (first: string, last: string) => update({ first, last }),
    setEmail: (email: string, pid: UUIDString) => update({ email, pid }),
    setTel: (phone: string) => update({ phone }),
    cleanup: () => {
      storage.remove(STORAGE_KEY);
      setStore({});
    },
  };
}
