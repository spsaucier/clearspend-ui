import { batch, createMemo, createSignal, JSXElement, Show } from 'solid-js';
import { useI18n } from 'solid-i18n';

import { Icon } from '_common/components/Icon';
import type { ExpenseCategory } from 'generated/capital';
import { Popover } from '_common/components/Popover';
import { Input } from '_common/components/Input';
import { KEY_CODES } from '_common/constants/keyboard';
import { Spin } from '_common/components/Spin';
import { isString } from '_common/utils/isString';
import { Divider } from '_common/components/Divider';

import { getOptions, isMatch } from './utils';
import { SelectExpenseCategoryContext } from './context';

import css from './SelectExpenseCategory.css';

interface SelectExpenseCategoryProps {
  value: ExpenseCategory | undefined;
  error?: boolean;
  onChange: (value: ExpenseCategory | undefined) => void;
  disabled?: boolean;
  loading?: boolean;
  children: JSXElement;
  createNewName?: string;
}

const FOCUS_OUT_DELAY = 200;

export function SelectExpenseCategory(props: Readonly<SelectExpenseCategoryProps>) {
  let input!: HTMLInputElement;
  let list!: HTMLUListElement;
  const i18n = useI18n();
  const [open, setOpen] = createSignal(false);
  const [search, setSearch] = createSignal('');

  let focusTimeout: number;
  const clearFocusTimeout = () => clearTimeout(focusTimeout);

  const options = () => {
    const text = search().toLowerCase();
    const items = getOptions(props.children);
    return !text ? items : items.filter(isMatch(text));
  };

  const selected = createMemo(() => (isString(props.value?.categoryName) ? props.value?.categoryName : undefined));

  const onSearch = (value: string) => {
    setSearch(value);
  };

  const close = (maintainFocus = false) => {
    clearFocusTimeout();
    focusTimeout = setTimeout(() => {
      setOpen(false);
      if (search()) {
        setSearch('');
        input.value = selected() || '';
      }
    }, FOCUS_OUT_DELAY);
    if (maintainFocus) {
      input.focus();
    }
  };

  const onFocusOut = () => {
    setTimeout(() => {
      if (!list.contains(document.activeElement)) {
        close();

        if (input.value === '') {
          props.onChange(undefined);
        }
      }
    });
  };

  const onFocusIn = () => {
    clearFocusTimeout();
    setOpen(true);
  };

  const onChange = (value: ExpenseCategory | undefined) => {
    props.onChange(value);
    batch(() => {
      setSearch('');
      setOpen(false);
      input.focus();
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if ([KEY_CODES.Tab, KEY_CODES.Escape].includes(e.keyCode)) {
      clearFocusTimeout();
      setOpen(false);
    } else if ([KEY_CODES.ArrowUp, KEY_CODES.ArrowDown].includes(e.keyCode)) {
      if (!list.contains(document.activeElement)) {
        (list.firstChild as HTMLElement).focus();
      }
      e.preventDefault();
    } else if (e.keyCode && ![KEY_CODES.Tab].includes(e.keyCode)) {
      setOpen(true);
    }
  };

  const renderList = () => (
    <ul class={css.list} ref={list}>
      <Show when={!!props.createNewName}>
        <li
          class={css.addNew}
          onClick={() => {
            onChange({ categoryName: props.createNewName });
          }}
        >
          <Icon class={css.icon} name="add-circle-outline" />
          <span>{`Create ${props.createNewName}`}</span>
        </li>
      </Show>
      <Divider />
      <SelectExpenseCategoryContext.Provider value={{ value: props.value, onChange, close }}>
        {options()}
      </SelectExpenseCategoryContext.Provider>
    </ul>
  );

  return (
    <Popover open={open()} class={css.popup} position="bottom-left" content={renderList()}>
      <div class={css.root} data-open={open()} data-view={open() || !selected() ? 'input' : ''}>
        <Input
          ref={input}
          name="expenseCategory"
          value={props.value?.categoryName}
          error={props.error}
          placeholder={String(i18n.t('Assign a category'))}
          disabled={props.disabled}
          inputClass={css.input}
          onChange={onSearch}
          onClick={onFocusIn}
          onFocusIn={onFocusIn}
          onFocusOut={onFocusOut}
          onKeyDown={onKeyDown}
          suffix={props.loading ? <Spin /> : null}
          autoComplete="off"
        />
        <span class={css.value}>{selected()}</span>
        <Icon name="chevron-down" size="sm" class={css.chevron} />
      </div>
    </Popover>
  );
}
