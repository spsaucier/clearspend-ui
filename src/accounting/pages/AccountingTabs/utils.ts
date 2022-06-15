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

export enum AccountingTimePeriod {
  week = 'week',
  month = 'month',
  quarter = 'quarter',
  year = 'year',
  today = 'today',
}

export function getAccountingTimePeriod(period: AccountingTimePeriod): [from: ReadonlyDate, to: ReadonlyDate] {
  const today: ReadonlyDate = new Date();

  switch (period) {
    case AccountingTimePeriod.week:
      return [startOfWeek(today), endOfWeek(today)];
    case AccountingTimePeriod.month:
      return [startOfMonth(today), endOfMonth(today)];
    case AccountingTimePeriod.quarter:
      return [startOfQuarter(today), endOfQuarter(today)];
    case AccountingTimePeriod.year:
      return [startOfYear(today), endOfYear(today)];
    case AccountingTimePeriod.today:
    default:
      return [startOfDay(today), endOfDay(today)];
  }
}

const HALF_DAY_HOURS = 12;
const MINUTES_DIGIT_CHECK = 10;
export function formatAMPM(date: Date) {
  let hours = date.getHours();
  let minutes: string | number = date.getMinutes();
  let ampm = hours >= HALF_DAY_HOURS ? 'PM' : 'AM';
  hours = hours % HALF_DAY_HOURS;
  hours = hours ? hours : HALF_DAY_HOURS; // the hour '0' should be '12'
  minutes = minutes < MINUTES_DIGIT_CHECK ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
}
