import type { DateRange } from '../types/common';

export function dateRangeToISO(range: [from: ReadonlyDate, to: ReadonlyDate]): Readonly<DateRange> {
  return { from: range[0].toISOString(), to: range[1].toISOString() };
}
