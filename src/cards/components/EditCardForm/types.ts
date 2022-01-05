import type { FormLimits } from 'allocations/types';

import type { CardType } from '../../types';

export interface FormValues extends FormLimits {
  allocationId: string;
  employee: string;
  types: CardType[];
  personal: boolean;
  streetLine1: string;
  streetLine2: string;
  locality: string;
  region: string;
  postalCode: string;
}
