const NUM_MASK_LENGTH = 4;

export function formatCardNumber(lastFour = ''): string {
  return `•••• ${lastFour.slice(-NUM_MASK_LENGTH)}`;
}
