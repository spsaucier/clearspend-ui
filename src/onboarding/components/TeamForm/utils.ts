import type { FormOptions } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { validEmail, validPhone, validZipCode } from '_common/components/Form/rules/patterns';
import { dateToString } from '_common/api/dates';
import type { CreateOrUpdateBusinessOwnerRequest, User } from 'generated/capital';

import { cleanSSN } from '../../../_common/formatters/ssn';

import type { FormValues } from './types';

export function getFormOptions(user?: Partial<User>): FormOptions<FormValues> {
  return {
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      birthdate: undefined,
      ssn: '',
      email: user?.email || '',
      phone: user?.phone || '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
    },
    rules: {
      firstName: [required],
      lastName: [required],
      birthdate: [required], // TODO
      ssn: [required],
      email: [required, validEmail],
      phone: [required, validPhone],
      line1: [required],
      city: [required],
      state: [required],
      zip: [required, validZipCode],
    },
  };
}

export function convertFormData(data: Readonly<FormValues>): Readonly<CreateOrUpdateBusinessOwnerRequest> {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    dateOfBirth: dateToString(data.birthdate!),
    taxIdentificationNumber: cleanSSN(data.ssn),
    email: data.email,
    phone: data.phone,
    address: {
      streetLine1: data.line1,
      streetLine2: data.line2,
      locality: data.city,
      region: data.state,
      postalCode: data.zip,
      country: 'USA',
    },
  };
}
