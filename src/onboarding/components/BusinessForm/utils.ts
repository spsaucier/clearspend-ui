import type { FormOptions } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { validPhone, validZipCode } from '_common/components/Form/rules/patterns';

import type { BusinessType, UpdateBusinessInfo } from '../../types';

import type { FormValues } from './types';

export function getFormOptions(): FormOptions<FormValues> {
  return {
    defaultValues: {
      name: '',
      type: '',
      ein: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
    },
    rules: {
      name: [required],
      type: [required],
      ein: [required],
      phone: [required, validPhone],
      line1: [required],
      city: [required],
      state: [required],
      zip: [required, validZipCode],
    },
  };
}

export function convertFormData(data: Readonly<FormValues>): Readonly<UpdateBusinessInfo> {
  return {
    legalName: data.name,
    businessType: data.type as BusinessType,
    employerIdentificationNumber: data.ein,
    phoneNumber: data.phone,
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
