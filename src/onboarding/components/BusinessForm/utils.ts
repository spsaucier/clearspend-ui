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
      line1: '',
      line2: '',
      city: '',
      state: '',
      zip: '',
    },
    rules: {
      name: [required],
      type: [required],
      ein: [required, (val) => validEIN(cleanEIN(val))],
      phone: [validPhone],
      line1: [required],
      city: [required],
      state: [required],
      zip: [required, validZipCode],
    },
  };
}

export function convertFormData(data: Readonly<FormValues>): Readonly<ConvertBusinessProspectRequest> {
  return {
    legalName: data.name,
    businessType: data.type as BusinessType,
    employerIdentificationNumber: cleanEIN(data.ein),
    businessPhone: data.phone,
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
