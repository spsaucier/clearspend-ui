import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfQuarter,
  endOfQuarter,
  startOfYear,
  endOfYear,
  startOfDay,
  endOfDay,
} from '_common/api/dates';

export enum TimePeriod {
  week = 'week',
  month = 'month',
  quarter = 'quarter',
  year = 'year',
  today = 'today',
}

export function getTimePeriod(period: TimePeriod): [from: ReadonlyDate, to: ReadonlyDate] {
  const today: ReadonlyDate = new Date();

  switch (period) {
    case TimePeriod.week:
      return [startOfWeek(today), endOfWeek(today)];
    case TimePeriod.month:
      return [startOfMonth(today), endOfMonth(today)];
    case TimePeriod.quarter:
      return [startOfQuarter(today), endOfQuarter(today)];
    case TimePeriod.year:
      return [startOfYear(today), endOfYear(today)];
    case TimePeriod.today:
    default:
      return [startOfDay(today), endOfDay(today)];
  }
}

export function toISO(range: [from: ReadonlyDate, to: ReadonlyDate]) {
  return {
    from: range[0].toISOString() as DateString,
    to: range[1].toISOString() as DateString,
  };
}

export function updateParams<T>(updates: Partial<T>) {
  return (prev: T): T => ({ ...prev, ...updates });
}
