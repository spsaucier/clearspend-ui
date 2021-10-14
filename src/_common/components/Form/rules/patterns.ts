export function validEmail(value: string): boolean | string {
  return !!value.match(/^[^@]+@[^@.]+\.[^@]+$/) || 'Invalid email';
}

export function validPhone(value: string): boolean | string {
  return !!value.match(/^\+[1-9][0-9]{9,14}$/) || 'Invalid phone number';
}

export function validZipCode(value: string): boolean | string {
  return !!value.match(/^[0-9]{5}(?:-[0-9]{4})?$/) || 'Invalid zip code';
}
