import { createSignal, createMemo, Accessor, For, Show } from 'solid-js';
import { DateTime } from 'solid-i18n';

import {
  shiftDate,
  DAYS_IN_WEEK,
  daysInMonth,
  getYear,
  getMonth,
  getDay,
  getWeekday,
  startOfMonth,
  dateToString,
} from '_common/api/dates';
import { DateFormat } from '_common/api/intl/types';
import { times } from '_common/utils/times';
import { join } from '_common/utils/join';

import { Icon } from '../Icon';
import { KEY_CODES } from '../../constants/keyboard';

import { getSelected, isInRange, isOutOfRange, getWeekdayNames, getMoveFocus, sameMonth } from './utils';
import type { Selected } from './utils';

import css from './Month.css';

const WEEKDAY_CHARACTERS = 2;

interface Day {
  id: string;
  date: ReadonlyDate;
  selected: Selected;
  inRange: boolean;
  disabled: boolean;
}

interface MonthProps {
  value: readonly (ReadonlyDate | undefined)[];
  month?: Accessor<ReadonlyDate>;
  class?: string;
  minDate?: ReadonlyDate;
  minPrevMonth?: Accessor<ReadonlyDate>;
  maxDate?: ReadonlyDate;
  maxNextMonth?: Accessor<ReadonlyDate>;
  onSelect: (date: ReadonlyDate) => void;
  setMonth?: (date: ReadonlyDate) => void;
}

export function Month(props: Readonly<MonthProps>) {
  let datesElement!: HTMLDivElement;

  // for uncontrolled state only
  const [month, setMonth] = createSignal(props.value[0] || new Date());

  // union value for using in render
  const currentMonth = createMemo(() => {
    return props.month ? props.month() : month();
  });

  const names = getWeekdayNames().map((name) => name.slice(0, WEEKDAY_CHARACTERS));

  const dates: Accessor<readonly Readonly<Day | undefined>[]> = createMemo(() => {
    const days = times(daysInMonth(currentMonth())).map((_: unknown, idx: number) => {
      const date = new Date(getYear(currentMonth()), getMonth(currentMonth()), idx + 1, 0, 0, 0, 0);
      return {
        date,
        id: dateToString(date),
        selected: getSelected(date, props.value),
        inRange: isInRange(date, props.value),
        disabled: isOutOfRange(date, props.minDate, props.maxDate),
      };
    });
    return [...times(getWeekday(startOfMonth(currentMonth()))), ...days];
  });

  const changeMonth = (prev?: boolean) => {
    const setMonthGeneric = (date: ReadonlyDate) => new Date(getYear(date), getMonth(date) + (prev ? -1 : 1));
    props.setMonth && props.month ? props.setMonth(setMonthGeneric(props.month())) : setMonth(setMonthGeneric);
  };

  const onNavKeyDown = (event: KeyboardEvent) => {
    if (event.target && event.keyCode === KEY_CODES.ArrowDown) {
      event.preventDefault();
      datesElement.querySelector<HTMLElement>('button:first-of-type')?.focus();
    }
  };

  const onDayKeyDown = (event: KeyboardEvent) => {
    if (!event.target) return;
    const move = getMoveFocus(datesElement, event.target, currentMonth());

    switch (event.keyCode) {
      case KEY_CODES.ArrowUp:
        event.preventDefault();
        move(-DAYS_IN_WEEK, () => changeMonth(true));
        break;
      case KEY_CODES.ArrowDown:
        event.preventDefault();
        move(DAYS_IN_WEEK, () => changeMonth());
        break;
      case KEY_CODES.ArrowLeft:
        event.preventDefault();
        move(-1, () => changeMonth(true));
        break;
      case KEY_CODES.ArrowRight:
        event.preventDefault();
        move(1, () => changeMonth());
        break;
      default:
    }
  };

  const hidePrev = createMemo(
    () =>
      (!!props.minPrevMonth && sameMonth(currentMonth(), shiftDate(props.minPrevMonth(), { months: 1 }))) ||
      (!!props.minDate && sameMonth(currentMonth(), props.minDate)),
  );

  const hideNext = createMemo(
    () =>
      (!!props.maxNextMonth && sameMonth(currentMonth(), shiftDate(props.maxNextMonth(), { months: -1 }))) ||
      (!!props.maxDate && sameMonth(currentMonth(), props.maxDate)),
  );

  return (
    <div class={join(css.root, props.class)}>
      <div class={css.header}>
        <Show fallback={<span class={css.navDisabled} />} when={!hidePrev()}>
          <button class={css.nav} onKeyDown={onNavKeyDown} onClick={() => changeMonth(true)}>
            <Icon name="chevron-left" />
          </button>
        </Show>
        <span>
          <DateTime date={currentMonth() as Date} preset={DateFormat.month} />
        </span>
        <Show fallback={<span class={css.navDisabled} />} when={!hideNext()}>
          <button class={css.nav} onKeyDown={onNavKeyDown} onClick={() => changeMonth()}>
            <Icon name="chevron-right" />
          </button>
        </Show>
      </div>
      <div class={css.weekdays}>
        <For each={names}>{(name) => <div class={css.weekday}>{name}</div>}</For>
      </div>
      <div ref={datesElement} class={css.days}>
        <For each={dates()}>
          {(date) => {
            if (!date) return <div class={join(css.day, css.empty)}>&nbsp;</div>;
            const day = getDay(date.date);

            return (
              <button
                tabIndex={day === 1 ? 0 : -1}
                data-day={getDay(date.date)}
                class={css.day}
                classList={{
                  [css.active!]: Boolean(date.selected),
                  [css.first!]: date.selected === 'first',
                  [css.last!]: date.selected === 'last',
                  [css.inRange!]: date.inRange,
                }}
                disabled={date.disabled}
                onClick={() => props.onSelect(date.date)}
                onKeyDown={onDayKeyDown}
              >
                {day}
              </button>
            );
          }}
        </For>
      </div>
    </div>
  );
}
