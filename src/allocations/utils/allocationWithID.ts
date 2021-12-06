import type { UUIDString } from 'app/types/common';

export function allocationWithID<T extends { allocationId: UUIDString }>(id: UUIDString | string | null | undefined) {
  return (item: T) => item.allocationId === id;
}
