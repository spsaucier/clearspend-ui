import type { AddressValues } from '../../../_common/components/AddressFormItems/types';

export interface FormValues extends AddressValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
