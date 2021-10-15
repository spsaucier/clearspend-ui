import { storage } from '_common/api/storage';

import type { SignupName } from './types';

const NAME_KEY = 'signup_name';

export const saveSignupName = (name: Readonly<SignupName>) => storage.set(NAME_KEY, name);
export const readSignupName = (): Readonly<SignupName> | null => storage.get(NAME_KEY);
