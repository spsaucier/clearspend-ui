import { i18n } from '../../api/intl';
import { DAYS_IN_WEEK, startOfWeek, shiftDate } from '../../api/dates';
import { times } from '../../utils/times';

export function getWeekdayNames(fromMonday: boolean = true): readonly string[] {
  const start = startOfWeek(new Date());

  return times(DAYS_IN_WEEK).map((_, index) => {
    const shift = index + (fromMonday ? 0 : -1);
    return i18n.formatDateTime(shiftDate(start, { days: shift }) as Date, { weekday: 'long' });
  });
}
