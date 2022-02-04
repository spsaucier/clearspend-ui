import type { AddressValues } from 'employees/components/AddressFormItems';

export interface FormValues extends AddressValues {
  name: string;
  type: string;
  ein: string;
  phone: string;
  url: string;
  mcc: string;
  description: string;
}
