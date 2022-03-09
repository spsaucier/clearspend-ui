import type { AddressValues } from 'employees/components/AddressFormItems';

export interface FormValues extends AddressValues {
  name: string;
  type: string;
  url: string;
  mcc: string;
  description: string;
  employerIdentificationNumber: string;
  phone: string;
  businessName: string;
}
