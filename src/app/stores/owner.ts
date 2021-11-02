import { createSignal } from 'solid-js';

import { storage } from '_common/api/storage';

import { login, logout } from '../services/auth';
import type { BusinessOwner } from '../types/businesses';

const STORAGE_KEY = 'owner';

const [owner, setOwner] = createSignal<BusinessOwner | null>(storage.get(STORAGE_KEY));

export const ownerStore = {
  get data() {
    return owner()!;
  },
  login: async (username: string, password: string) => {
    const data = await login(username, password);
    storage.set(STORAGE_KEY, data);
    setOwner(data);
  },
  logout: async () => {
    await logout();
    storage.remove(STORAGE_KEY);
  },
};
