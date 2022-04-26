import { Accessor, createSignal, createMemo, batch } from 'solid-js';
import { useI18n } from 'solid-i18n';

import { KEY_CODES } from '../../constants/keyboard';
import { DateFormat } from '../../api/intl/types';
import { Input } from '../Input';
import { Icon } from '../Icon';
import { Popover } from '../Popover';

import { Month } from './Month';

import css from './InputDate.css';

const FOCUS_OUT_DELAY = 200;
const DATE_REGEXP = /^([\d]{1,2})[/\s-]([\d]{1,2})[/\s-]([\d]{4})$/i;
const DATE_MATCH_LENGTH = 4;

const toInt = (value: string) => parseInt(value, 10);

export interface InputDateProps {
  name?: string;
  class?: string;
  value?: ReadonlyDate | number;
  error?: boolean;
  placeholder?: string;
  onChange?: (date: ReadonlyDate | undefined) => void;
}

export function InputDate(props: Readonly<InputDateProps>) {
  let element!: HTMLInputElement;
  let dialog!: HTMLDivElement;

  const i18n = useI18n();
  const [open, setOpen] = createSignal(false);

  let focusTimeout: number;
  const clearFocusTimeout = () => clearTimeout(focusTimeout);

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case KEY_CODES.Tab:
        clearFocusTimeout();
        setOpen(false);
        break;
      case KEY_CODES.ArrowDown:
        event.preventDefault();
        if (!open()) setOpen(true);
        dialog.querySelectorAll('button')[0]?.focus();
        clearFocusTimeout();
        break;
      default:
    }
  };

  const onChange = (value: string) => {
    if (open()) setOpen(false);

    const input = value.trim();
    if (!input) props.onChange?.(undefined);

    const match = input.match(DATE_REGEXP);

    if (match?.length === DATE_MATCH_LENGTH) {
      props.onChange?.(new Date(toInt(match[3]!), toInt(match[1]!) - 1, toInt(match[2]!), 0, 0, 0, 0));
    }
  };

  const onSelect = (date: ReadonlyDate) => {
    batch(() => {
      props.onChange?.(date);
      setOpen(false);
      element.focus();
    });
  };

  const value: Accessor<ReadonlyDate | undefined> = createMemo(() => {
    const date = props.value;
    if (typeof date === 'number') return new Date(date);
    if (date instanceof Date) return date;
    return undefined;
  });

  const strValue = createMemo(() => value() && i18n.formatDateTime(value() as Date, DateFormat.date));

  return (
    <Popover
      ref={dialog}
      open={open()}
      class={css.popup}
      onClickOutside={() => setOpen(false)}
      content={
        <div class={css.calendar} onClick={clearFocusTimeout}>
          <Month value={[value()]} onSelect={onSelect} />
        </div>
      }
    >
      <Input
        ref={element}
        name={props.name}
        value={strValue()}
        suffix={<Icon name="calendar" />}
        class={props.class}
        error={props.error}
        autoComplete="chrome-off"
        placeholder={props.placeholder ?? 'MM/DD/YYYY'}
        onClick={() => setOpen(true)}
        onFocusIn={() => setOpen(true)}
        onFocusOut={() => {
          clearFocusTimeout();
          focusTimeout = setTimeout(() => setOpen(false), FOCUS_OUT_DELAY);
        }}
        onKeyDown={onKeyDown}
        onChange={onChange}
      />
    </Popover>
  );
}
