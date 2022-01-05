const NUM_MASK_LENGTH = 4;

export function formatCardNumber(lastFour = ''): string {
  if (lastFour.length <= NUM_MASK_LENGTH) {
    return `•••• ${lastFour.slice(-NUM_MASK_LENGTH)}`;
  }
  return lastFour;
}
