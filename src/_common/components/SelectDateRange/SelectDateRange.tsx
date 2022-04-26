import { createSignal, createMemo, Accessor } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import { startOfDay, endOfDay, shiftDate } from '_common/api/dates';

import { Popover } from '../Popover';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Month } from '../InputDate/Month';
import { DateFormat } from '../../api/intl/types';
import { KEY_CODES } from '../../constants/keyboard';

import css from './SelectDateRange.css';

const RANGE_COUNT = 2;

export interface SelectDateRangeProps {
  name?: string;
  value: readonly (ReadonlyDate | undefined)[];
  error?: boolean;
  disabled?: boolean;
  class?: string;
  minDate?: ReadonlyDate;
  maxDate?: ReadonlyDate;
  onChange: (value: ReadonlyDate[]) => void;
}

const getDefaultsFromRange = (range: Accessor<ReadonlyDate[]>) => {
  let [fromDefault, toDefault] = range();
  if (!toDefault) {
    if (fromDefault) {
      toDefault = shiftDate(fromDefault, { months: 1 });
    } else {
      toDefault = new Date();
    }
  }
  if (!fromDefault) {
    fromDefault = shiftDate(toDefault, { months: -1 });
  }
  return [fromDefault, toDefault];
};

export function SelectDateRange(props: Readonly<SelectDateRangeProps>) {
  const i18n = useI18n();
  let dialog!: HTMLDivElement;

  const [open, setOpen] = createSignal(false);
  const [range, setRange] = createSignal<ReadonlyDate[]>([...(props.value as ReadonlyDate[])]);

  const [fromDefault, toDefault] = getDefaultsFromRange(range);
  const [toMonth, setToMonth] = createSignal(toDefault!);
  const [fromMonth, setFromMonth] = createSignal(fromDefault!);

  const onClear = (event?: MouseEvent) => {
    if (event) event.stopPropagation();
    setRange([]);
    props.onChange([]);
  };

  const onSelectDate = (date: ReadonlyDate) => {
    setRange((current) =>
      current.length === 1 ? [...current, date].sort((a, b) => a.getTime() - b.getTime()) : [date],
    );
  };

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case KEY_CODES.Tab:
        setOpen(false);
        break;
      case KEY_CODES.ArrowDown:
        event.preventDefault();
        dialog.querySelectorAll('button')[0]?.focus();
        break;
      case KEY_CODES.Delete:
        setOpen(false);
        onClear();
        break;
      default:
    }
  };

  const onChange = () => {
    const [from, to] = range();
    if (!from || !to) return;
    props.onChange([startOfDay(from), endOfDay(to)]);
    setOpen(false);
  };

  const value = createMemo(() => {
    const [from, to] = props.value;
    return from && to ? (
      <span class={css.value}>{i18n.t('{from} – {to}', { from: from as Date, to: to as Date })}</span>
    ) : (
      i18n.t('Choose Dates')
    );
  });

  return (
    <Popover
      ref={dialog}
      open={open()}
      class={css.popup}
      onClickOutside={() => setOpen(false)}
      content={
        <div>
          <div class={css.content}>
            <Month
              month={fromMonth}
              value={range()}
              class={css.month}
              setMonth={setFromMonth}
              onSelect={onSelectDate}
              minDate={props.minDate}
              maxNextMonth={toMonth}
            />
            <Month
              month={toMonth}
              value={range()}
              class={css.month}
              setMonth={setToMonth}
              onSelect={onSelectDate}
              minPrevMonth={fromMonth}
              maxDate={props.maxDate}
            />
          </div>
          <div class={css.footer}>
            <Button view="ghost" onClick={() => setOpen(false)}>
              <Text message="Cancel" />
            </Button>
            <Button
              type="primary"
              icon={{ name: 'confirm', pos: 'right' }}
              disabled={range().length !== RANGE_COUNT}
              class={css.set}
              onClick={onChange}
            >
              <Text message="Set Dates" />
            </Button>
          </div>
        </div>
      }
    >
      <div
        class={css.root}
        classList={{
          [css.hasValue!]: props.value.length === RANGE_COUNT,
          [css.error!]: props.error,
          [css.disabled!]: props.disabled,
        }}
        onClick={() => !props.disabled && setOpen((prev) => !prev)}
      >
        <div class={css.inputs}>
          <input
            type="text"
            name={props.name ? `${props.name}-from` : undefined}
            data-name={props.name ? `${props.name}-from` : undefined}
            value={props.value[0] && i18n.formatDateTime(props.value[0] as Date, DateFormat.date)}
            autocomplete="chrome-off"
            disabled={props.disabled}
            onFocusIn={() => setOpen(true)}
            onKeyDown={onKeyDown}
          />
          <input
            type="text"
            tabIndex="-1"
            name={props.name ? `${props.name}-to` : undefined}
            data-name={props.name ? `${props.name}-to` : undefined}
            value={props.value[1] && i18n.formatDateTime(props.value[1] as Date, DateFormat.date)}
            autocomplete="chrome-off"
            disabled={props.disabled}
            onKeyDown={onKeyDown}
          />
        </div>
        <span class={css.wrapper}>{value()}</span>
        <Icon name="calendar" size="sm" class={css.icon} />
        <Button view="ghost" size="sm" icon="cancel" class={css.clear} onClick={onClear} />
      </div>
    </Popover>
  );
}
