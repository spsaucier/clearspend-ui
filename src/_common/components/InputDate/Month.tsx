import { createSignal, createMemo, Accessor, For, Index, Show, createEffect } from 'solid-js';
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

import { isSelected, isInRange, getWeekdayNames, getMoveFocus, sameMonth } from './utils';

import css from './Month.css';

const WEEKDAY_CHARACTERS = 2;

interface Day {
  id: string;
  date: ReadonlyDate;
  selected: boolean;
  inRange: boolean;
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
  const [hidePrev, setHidePrev] = createSignal(false);
  const [hideNext, setHideNext] = createSignal(false);
  let datesElement!: HTMLDivElement;

  // for uncontrolled state only
  const [month, setMonth] = createSignal(props.value[0] || new Date());

  // union value for using in render
  const currentMonth = createMemo(() => {
    return props.month ? props.month() : month();
  });

  const names = getWeekdayNames().map((name) => name.slice(0, WEEKDAY_CHARACTERS));

  const shift: Accessor<readonly unknown[]> = createMemo(() => times(getWeekday(startOfMonth(currentMonth()))));

  const dates: Accessor<readonly Readonly<Day>[]> = createMemo(() => {
    return times(daysInMonth(currentMonth())).map((_: unknown, idx: number) => {
      const date = new Date(getYear(currentMonth()), getMonth(currentMonth()), idx + 1, 0, 0, 0, 0);
      return {
        date,
        id: dateToString(date),
        selected: isSelected(date, props.value),
        inRange: isInRange(date, props.value),
      };
    });
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

  createEffect(() => {
    const hide =
      (props.minPrevMonth && sameMonth(currentMonth(), shiftDate(props.minPrevMonth(), { months: 1 }))) ||
      (props.minDate && sameMonth(currentMonth(), props.minDate));
    setHidePrev(!!hide);
  });

  createEffect(() => {
    const hide =
      (props.maxNextMonth && sameMonth(currentMonth(), shiftDate(props.maxNextMonth(), { months: -1 }))) ||
      (props.maxDate && sameMonth(currentMonth(), props.maxDate));
    setHideNext(!!hide);
  });

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
        <For each={shift()}>{() => <div class={join(css.day, css.empty)}>&nbsp;</div>}</For>
        <Index each={dates()}>
          {(item, index) => (
            <button
              tabIndex={index === 0 ? 0 : -1}
              data-day={getDay(item().date)}
              class={css.day}
              classList={{ [css.active!]: item().selected, [css.inRange!]: item().inRange }}
              onClick={() => props.onSelect(item().date)}
              onKeyDown={onDayKeyDown}
              disabled={
                (props.maxDate && props.maxDate < item().date) ||
                (props.minDate && props.minDate > item().date && !sameMonth(props.minDate, item().date))
              }
            >
              {getDay(item().date)}
            </button>
          )}
        </Index>
      </div>
    </div>
  );
}
