import type { FormOptions } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { validEmail, validPhone } from '_common/components/Form/rules/patterns';
import type { User } from 'generated/capital';

import type { FormValues } from './types';

export function getFormOptions(user?: Readonly<User>): FormOptions<FormValues> {
  return {
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
      streetLine1: user?.address?.streetLine1 || '',
      streetLine2: user?.address?.streetLine2 || '',
      locality: user?.address?.locality || '',
      region: user?.address?.region || '',
      postalCode: user?.address?.postalCode || '',
    },
    rules: {
      firstName: [required],
      lastName: [required],
      email: [required, validEmail],
      phone: [required, (val) => validPhone(val)],
    },
  };
}
