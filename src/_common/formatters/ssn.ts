export const cleanSSN = (val: string) => val!.replace(/[^\d]/g, '') || '';

export function formatSSN(val: string): string {
  return val.replace(/[^\d]/g, '').replace(/^(\d{3})(\d{2})(\d{4})$/, '$1-$2-$3');
}
