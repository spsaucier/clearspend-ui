import { i18n } from '../../api/intl';
import { DAYS_IN_WEEK, startOfWeek, shiftDate, getYear, getMonth, getDay, isSameDates } from '../../api/dates';
import { times } from '../../utils/times';

export type Selected = 'first' | 'last' | boolean;

export function getSelected(date: ReadonlyDate, range: readonly (ReadonlyDate | undefined)[]): Selected {
  const [from, to] = range;
  if (from && to) {
    if (isSameDates(date, from)) return 'first';
    if (isSameDates(date, to)) return 'last';
  }
  return from && !to ? isSameDates(date, from) : false;
}

export function isInRange(date: ReadonlyDate, range: readonly (ReadonlyDate | undefined)[]): boolean {
  const [from, to] = range;
  return !!from && !!to && date > from && date < to;
}

export function isOutOfRange(date: ReadonlyDate, minDate?: ReadonlyDate, maxDate?: ReadonlyDate): boolean {
  return (
    (!!maxDate && maxDate < date && !isSameDates(maxDate, date)) ||
    (!!minDate && minDate > date && !isSameDates(minDate, date))
  );
}

export function getWeekdayNames(fromMonday: boolean = true): readonly string[] {
  const start = startOfWeek(new Date());

  return times(DAYS_IN_WEEK).map((_, index) => {
    const shift = index + (fromMonday ? 0 : -1);
    return i18n.formatDateTime(shiftDate(start, { days: shift }) as Date, { weekday: 'long' });
  });
}

function getDayButton(wrapper: HTMLElement, day: number) {
  return wrapper.querySelector<HTMLElement>(`button[data-day='${day}']`);
}

export const sameMonth = (date1: ReadonlyDate, date2: ReadonlyDate): boolean =>
  getYear(date1) === getYear(date2) && getMonth(date1) === getMonth(date2);

export function getMoveFocus(wrapper: HTMLElement, target: EventTarget, month: ReadonlyDate) {
  return (shift: number, onMonthChange: () => void) => {
    const day = parseInt((target as HTMLElement).dataset.day!, 10) + shift;
    const next = getDayButton(wrapper, day);

    if (next) {
      next.focus();
    } else {
      const date = new Date(getYear(month), getMonth(month), day, 0, 0, 0, 0);
      onMonthChange();
      getDayButton(wrapper, getDay(date))?.focus();
    }
  };
}
