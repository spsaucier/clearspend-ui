import type { UUIDString } from 'app/types/common';
import { storage } from '_common/api/storage';

const PROSPECT_ID_KEY = 'ob_prospect_id';

function read(name: string) {
  const id = storage.get<UUIDString>(name);
  if (!id) throw new Error();
  return id;
}

export const saveBusinessProspectID = (id: UUIDString) => storage.set(PROSPECT_ID_KEY, id);
export const readBusinessProspectID = (): UUIDString => read(PROSPECT_ID_KEY);
export const removeBusinessProspectID = () => storage.remove(PROSPECT_ID_KEY);
