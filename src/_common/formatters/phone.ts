export function cleanPhone(val: string): string {
  return val.replace(/[^\d]/g, '');
}

export function parsePhone(val: string) {
  const num = cleanPhone(val);
  return { code: num.slice(0, 1), value: num.slice(1) };
}

export function preparePhone(val: string): string {
  const num = cleanPhone(val);
  return num ? `+${num}` : '';
}

export function formatPhone(val: string | undefined): string {
  if (!val) return '';
  return val
    .replace(/[^\d]/g, '')
    .replace(/^(\d)?(\d{3})(\d{3})(\d{4})$/, '+$1 ($2) $3-$4')
    .replace('+ ', '');
}
