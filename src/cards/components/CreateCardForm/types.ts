import type { AddressValues } from 'employees/components/AddressFormItems/types';

import type { LegacyIssueCardRequest } from '../../types';

export interface FormValues extends AddressValues {
  allocations: string[];
  employee: string;
  type: LegacyIssueCardRequest['cardType'] | '';
  personal: boolean;
}
