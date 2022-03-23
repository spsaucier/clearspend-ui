import type { AddressValues } from './types';

export function getEmptyAddress(): Readonly<AddressValues> {
  return {
    streetLine1: '',
    streetLine2: '',
    locality: '',
    region: '',
    postalCode: '',
  };
}
