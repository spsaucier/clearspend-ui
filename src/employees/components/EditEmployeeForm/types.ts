import type { AddressValues } from '../AddressFormItems';

export interface FormValues extends AddressValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
