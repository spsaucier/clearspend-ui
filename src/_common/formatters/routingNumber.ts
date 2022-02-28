export function formatRoutingNumber(value: string): string {
  return value.replace(/[^\d]/g, '').replace(/^(\d{4})(\d{5})(\d{4})(\d{3})$/, '$1 $2 $3 $4');
}
