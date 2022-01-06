import type { FormOptions } from '_common/components/Form';
import { required } from '_common/components/Form/rules/required';
import { validPhone, validEIN, validZipCode } from '_common/components/Form/rules/patterns';
import type { BusinessType } from 'app/types/businesses';
import { cleanEIN } from '_common/formatters/ein';
import type { ConvertBusinessProspectRequest } from 'generated/capital';

import type { FormValues } from './types';

export function getFormOptions(): FormOptions<FormValues> {
  return {
    defaultValues: {
      name: '',
      type: '',
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
      type: [required],
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
  const { name, type, ein, phone, ...address } = data;
  return {
    legalName: name,
    businessType: type as BusinessType,
    employerIdentificationNumber: cleanEIN(ein),
    businessPhone: phone,
    address: { ...address, country: 'USA' },
  };
}
