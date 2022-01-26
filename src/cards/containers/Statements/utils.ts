import { MONTHS_IN_YEAR, shiftDate } from '_common/api/dates';

const MAX_YEARS = 3;

export function getDateRange(issueDate: string, expirationDate: string): [Date, Date] {
  return [
    new Date(Math.max(new Date(issueDate).getTime(), shiftDate(new Date(), { years: -MAX_YEARS }).getTime())),
    new Date(Math.min(Date.now(), new Date(expirationDate).getTime())),
  ];
}

export function getMonthDiff(from: Date, to: Date): number {
  return to.getMonth() + 1 - from.getMonth() + (to.getFullYear() - from.getFullYear()) * MONTHS_IN_YEAR;
}
