import { createSignal, createMemo, Accessor, For } from 'solid-js';

import {
  daysInMonth,
  getYear,
  getMonth,
  getDay,
  getWeekday,
  startOfMonth,
  dateToString,
  isSameDates,
} from '_common/api/dates';
import { times } from '_common/utils/times';
import { join } from '_common/utils/join';

import { Icon } from '../Icon';

import css from './Month.css';

const WEEK_DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

interface Day {
  id: string;
  date: ReadonlyDate;
  selected: boolean;
}

interface MonthProps {
  value?: ReadonlyDate;
  onSelect?: (date: ReadonlyDate) => void;
}

export function Month(props: Readonly<MonthProps>) {
  const [month, setMonth] = createSignal(props.value || new Date());

  // TODO: Use i18n?
  const title = createMemo(() => month().toLocaleDateString('en-US', { year: 'numeric', month: 'short' }));

  const shift: Accessor<readonly unknown[]> = createMemo(() => times(getWeekday(startOfMonth(month()))));

  const dates: Accessor<readonly Readonly<Day>[]> = createMemo(() => {
    return times(daysInMonth(month())).map((_: unknown, idx: number) => {
      const date = new Date(getYear(month()), getMonth(month()), idx + 1);
      return { id: dateToString(date), date, selected: !!props.value && isSameDates(date, props.value) };
    });
  });

  const changeMonth = (prev?: boolean) => {
    setMonth((date) => new Date(getYear(date), getMonth(date) + (prev ? -1 : 1)));
  };

  return (
    <div class={css.root}>
      <div class={css.header}>
        <button class={css.nav} onClick={() => changeMonth(true)}>
          <Icon name="chevron-left" />
        </button>
        <span>{title()}</span>
        <button class={css.nav} onClick={() => changeMonth()}>
          <Icon name="chevron-right" />
        </button>
      </div>
      <div class={css.weekdays}>
        <For each={WEEK_DAY_NAMES}>{(name) => <div class={css.weekday}>{name}</div>}</For>
      </div>
      <div class={css.days}>
        <For each={shift()}>{() => <div class={join(css.day, css.empty)}>&nbsp;</div>}</For>
        <For each={dates()}>
          {(item) => (
            <button
              class={css.day}
              classList={{ [css.active!]: item.selected }}
              onClick={() => props.onSelect?.(item.date)}
            >
              {getDay(item.date)}
            </button>
          )}
        </For>
      </div>
    </div>
  );
}
