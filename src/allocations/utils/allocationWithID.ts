export function allocationWithID<T extends { allocationId: string }>(id: string | null | undefined) {
  return (item: T) => item.allocationId === id;
}
