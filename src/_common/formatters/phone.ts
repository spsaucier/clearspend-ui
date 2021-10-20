export function cleanPhone(val: string): string {
  const num = val.replace(/[^\d]/g, '');
  return num ? `+${num}` : '';
}

export function formatPhone(val: string): string {
  return val.replace(/[^\d]/g, '').replace(/^\+?([1-9])(\d{3})(\d{3})(\d{4})$/, '+$1 ($2) $3-$4');
}
