import type { FormOptions } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { validEmail } from '_common/components/Form/rules/patterns';

import type { User } from '../../types';

import type { FormValues } from './types';

export function getFormOptions(user?: Readonly<User>): FormOptions<FormValues> {
  return {
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
    },
    rules: { firstName: [required], lastName: [required], email: [required, validEmail] },
  };
}
