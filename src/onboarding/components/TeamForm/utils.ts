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
      streetLine1: '',
      streetLine2: '',
      locality: '',
      region: '',
      postalCode: '',
    },
    rules: {
      firstName: [required],
      lastName: [required],
      birthdate: [required],
      ssn: [required],
      email: [required, validEmail],
      phone: [required, validPhone],
      streetLine1: [required],
      locality: [required],
      region: [required],
      postalCode: [required, validZipCode],
    },
  };
}

export function convertFormData(data: Readonly<FormValues>): Readonly<CreateOrUpdateBusinessOwnerRequest> {
  const { firstName, lastName, birthdate, ssn, email, phone, ...address } = data;
  return {
    firstName,
    lastName,
    dateOfBirth: dateToString(birthdate!),
    taxIdentificationNumber: cleanSSN(ssn),
    email,
    phone,
    address: { ...address, country: 'USA' },
  };
}
