import type { UUIDString } from 'app/types';
import { storage } from '_common/api/storage';

const PROSPECT_ID_KEY = 'bpid';
const OWNER_ID_KEY = 'boid';
const BUSINESS_ID_KEY = 'bid';

function read(name: string) {
  const id = storage.get<UUIDString>(name);
  if (!id) throw new Error();
  return id;
}

export const saveBusinessProspectID = (id: UUIDString) => storage.set(PROSPECT_ID_KEY, id);
export const readBusinessProspectID = (): UUIDString => read(PROSPECT_ID_KEY);
export const removeBusinessProspectID = () => storage.remove(PROSPECT_ID_KEY);

export const saveBusinessOwnerID = (id: UUIDString) => storage.set(OWNER_ID_KEY, id);
export const readBusinessOwnerID = (): UUIDString => read(OWNER_ID_KEY);
export const removeBusinessOwnerID = () => storage.remove(OWNER_ID_KEY);

export const saveBusinessID = (id: UUIDString) => storage.set(BUSINESS_ID_KEY, id);
export const readBusinessID = (): UUIDString => read(BUSINESS_ID_KEY);
