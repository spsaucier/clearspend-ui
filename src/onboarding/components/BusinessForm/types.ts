import type { AddressValues } from '_common/components/AddressFormItems/types';

export interface FormValues extends AddressValues {
  name: string;
  type: string;
  ein: string;
  phone: string;
  url: string;
  mcc: string;
  description: string;
}
