import { createSignal, createMemo, For } from 'solid-js';

import { Select, Option } from '../Select';
import { MONTHS_IN_YEAR, getYear, endOfMonth, getDay, getMonth } from '../../api/dates';
import { times } from '../../utils/times';
import { i18n } from '../../api/intl';

import css from './SelectDateOfBirth.css';

const MAX_DAYS = 31;
const YEARS_COUNT = 105;
const MIN_AGE = 18;

const toInt = (value: string) => parseInt(value, 10);
const toStr = (date: ReadonlyDate | undefined, func: (date: ReadonlyDate) => number) =>
  date ? String(func(date)) : '';

function getMonthNames(): readonly string[] {
  return times(MONTHS_IN_YEAR).map((_, idx) => i18n.formatDateTime(new Date(0, idx), { month: 'long' }));
}

function getYears(): readonly string[] {
  const current = getYear(new Date()) - MIN_AGE;
  return times(YEARS_COUNT).map((_, idx) => (current - idx).toString());
}

export interface SelectDateOfBirthProps {
  name?: string;
  value?: ReadonlyDate;
  error?: boolean;
  disabled?: boolean;
  onChange?: (value: ReadonlyDate) => void;
}

export function SelectDateOfBirth(props: Readonly<SelectDateOfBirthProps>) {
  const [days, setDays] = createSignal(props.value ? getDay(endOfMonth(props.value)) : MAX_DAYS);

  const [day, setDay] = createSignal(toStr(props.value, getDay));
  const [month, setMonth] = createSignal(toStr(props.value, getMonth));
  const [year, setYear] = createSignal(toStr(props.value, getYear));

  const checkDays = () => {
    if (year() && month()) {
      const lastDay = getDay(endOfMonth(new Date(toInt(year()), toInt(month()))));
      if (toInt(day()) > lastDay) setDay('');
      setDays(lastDay);
    }
  };

  const onChange = () => {
    if (day() && month() && year()) {
      props.onChange?.(new Date(toInt(year()), toInt(month()), toInt(day())));
    }
  };

  const getDays = createMemo(() => times(days()).map((_, idx) => (idx + 1).toString()));

  return (
    <div class={css.root}>
      <Select
        name={props.name ? `${props.name}--month` : undefined}
        value={month()}
        placeholder={String(i18n.t('Month'))}
        error={props.error}
        disabled={props.disabled}
        popupClass={css.monthPopup}
        onChange={(value) => {
          if (!value) return;
          setMonth(value);
          checkDays();
          onChange();
        }}
      >
        <For each={getMonthNames()}>{(item, idx) => <Option value={String(idx())}>{item}</Option>}</For>
      </Select>
      <Select
        name={props.name ? `${props.name}--day` : undefined}
        value={day()}
        placeholder={String(i18n.t('Day'))}
        error={props.error}
        disabled={props.disabled}
        onChange={(value) => {
          if (!value) return;
          setDay(value);
          onChange();
        }}
      >
        <For each={getDays()}>{(item) => <Option value={item}>{item}</Option>}</For>
      </Select>
      <Select
        name={props.name ? `${props.name}--year` : undefined}
        value={year()}
        placeholder={String(i18n.t('Year'))}
        error={props.error}
        disabled={props.disabled}
        onChange={(value) => {
          if (!value) return;
          setYear(value);
          checkDays();
          onChange();
        }}
      >
        <For each={getYears()}>{(item) => <Option value={item}>{item}</Option>}</For>
      </Select>
    </div>
  );
}
