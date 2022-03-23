import type { FormLimits } from 'allocations/types';
import type { AddressValues } from 'employees/components/AddressFormItems/types';

import type { CardType } from '../../types';

export interface FormValues extends FormLimits, AddressValues {
  allocationId: string;
  employee: string;
  types: CardType[];
  personal: boolean;
}
