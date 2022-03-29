import type { AddressValues } from 'employees/components/AddressFormItems/types';

export interface FormValues extends AddressValues {
  firstName: string;
  lastName: string;
  birthdate: ReadonlyDate | undefined;
  ssn: string;
  email: string;
  phone: string;
  percentageOwnership: string;
  title?: string;
  relationshipOwner?: boolean;
  relationshipExecutive?: boolean;
}
