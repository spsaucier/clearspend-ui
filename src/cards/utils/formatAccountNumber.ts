const NUM_MASK_LENGTH = 4;

export function formatAccountNumber(value = ''): string {
  return value ? `•••• ${value.slice(-NUM_MASK_LENGTH)}` : '••••';
}
