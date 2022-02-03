import type { Address } from 'generated/capital';

export function formatAddress(value: Readonly<Address>): string {
  const line3 = `${value.locality}, ${value.region} ${value.postalCode}`;
  return [value.streetLine1, value.streetLine2, line3].filter(Boolean).join('\n');
}
