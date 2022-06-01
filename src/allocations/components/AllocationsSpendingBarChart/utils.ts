export function random(min: number, max: number) {
  // eslint-disable-next-line @typescript-eslint/no-magic-numbers
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}
