import type { FormOptions } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { validEmail, validZipCode } from '_common/components/Form/rules/patterns';
import { dateToString } from '_common/api/dates';

import type { UpdateBusinessOwner } from '../../types';

import type { FormValues } from './types';

export function getFormOptions(): FormOptions<FormValues> {
  return {
    defaultValues: {
      firstName: '',
      lastName: '',
      birthdate: undefined,
      ssn: '',
      email: '',
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
      ssn: [required], // TODO
      email: [required, validEmail],
      line1: [required],
      city: [required],
      state: [required],
      zip: [required, validZipCode],
    },
  };
}

export function convertFormData(data: Readonly<FormValues>): Readonly<UpdateBusinessOwner> {
  return {
    firstName: data.firstName,
    lastName: data.lastName,
    birthdate: dateToString(data.birthdate!),
    taxNumber: data.ssn,
    email: data.email,
    // TODO
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
