import type { FormLimits } from '../../types';

export interface FormValues extends FormLimits {
  name: string;
  parent: string;
  amount: string;
  owner: string;
}
