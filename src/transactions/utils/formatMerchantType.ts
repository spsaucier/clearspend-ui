import { capitalize } from '_common/utils/capitalize';

export function formatMerchantType(value?: string): string {
  return (value || '').split(/_/).map(capitalize).join(' ');
}
