import type { FormOptions } from '_common/components/Form';
import { validStreetLine1 } from '_common/components/Form/rules/patterns';
import type { User } from 'generated/capital';

import type { AddressValues } from '../AddressFormItems/types';

export function getFormOptions(user?: Readonly<User>): FormOptions<AddressValues> {
  return {
    defaultValues: {
      streetLine1: user?.address?.streetLine1 || '',
      streetLine2: user?.address?.streetLine2 || '',
      locality: user?.address?.locality || '',
      region: user?.address?.region || '',
      postalCode: user?.address?.postalCode || '',
    },
    rules: {
      streetLine1: [validStreetLine1],
    },
  };
}
