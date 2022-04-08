import type { Setter } from '_common/types/common';

interface Generic {
  searchText?: string;
}

export function changeRequestSearch<T extends Readonly<Generic>>(setter: Setter<T>) {
  return (searchText: string): void => setter((prev) => ({ ...prev, searchText: searchText || undefined }));
}
