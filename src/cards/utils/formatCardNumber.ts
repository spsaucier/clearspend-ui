const NUM_MASK_LENGTH = 4;

export function formatCardNumber(value = ''): string {
  return value ? `•••• ${value.slice(-NUM_MASK_LENGTH)}` : '••••';
}
