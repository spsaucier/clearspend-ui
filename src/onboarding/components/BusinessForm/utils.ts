import type { FormOptions } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { validPhone, validEIN, validZipCode } from '_common/components/Form/rules/patterns';
import { cleanEIN } from '_common/formatters/ein';
import type { ConvertBusinessProspectRequest } from 'generated/capital';

import type { FormValues } from './types';

export function getFormOptions(): FormOptions<FormValues> {
  return {
    defaultValues: {
      name: '',
      url: '',
      mcc: '',
      description: '',
      ein: '',
      phone: '',
      streetLine1: '',
      streetLine2: '',
      locality: '',
      region: '',
      postalCode: '',
    },
    rules: {
      name: [required],
      ein: [required, (val) => validEIN(cleanEIN(val))],
      phone: [validPhone],
      streetLine1: [required],
      locality: [required],
      region: [required],
      postalCode: [required, validZipCode],
    },
  };
}

export function convertFormData(data: Readonly<FormValues>): Readonly<ConvertBusinessProspectRequest> {
  const { name, ein, phone, mcc, url, description, ...address } = data;
  return {
    legalName: name,
    employerIdentificationNumber: cleanEIN(ein),
    businessPhone: phone,
    address: { ...address, country: 'USA' },
    mcc: parseInt(mcc, 10),
    url,
    description,
  };
}
