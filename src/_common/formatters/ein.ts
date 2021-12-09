export const cleanEIN = (val: string) => val!.replace(/[^\d]/g, '') || '';

export function formatEIN(val: string): string {
  return val.replace(/[^\d]/g, '').replace(/^(\d{2})(\d{7})$/, '$1-$2');
}
