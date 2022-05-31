import { createMemo, createSignal, For, onCleanup, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { i18n } from '_common/api/intl';
import { Popover } from '_common/components/Popover';
import type { CodatSupplier } from 'generated/capital';
import { Icon } from '_common/components/Icon';
import { Input } from '_common/components/Input';

import css from './SelectVendor.css';

interface SelectVendorProps {
  defaultSearchName: string;
  merchantName: string | undefined;
  onChangeTarget: (target: string) => void;
  items: CodatSupplier[];
  onSelect: (supplier: CodatSupplier) => void;
  value: string | undefined;
  onCreate: (supplierName: string) => void;
  disabled?: boolean;
}

const SEARCH_DELAY = 400;

export function SelectVendor(props: Readonly<SelectVendorProps>) {
  const [open, setOpen] = createSignal(false);
  const [searchValue, setSearchValue] = createSignal(props.value || '');

  let timer: number;

  const onChangeSearch = (value: string) => {
    setSearchValue(value);
    props.onChangeTarget(value);
  };

  const onChange = (value: string) => {
    clearTimeout(timer);
    timer = setTimeout(() => onChangeSearch(value), SEARCH_DELAY);
  };

  onCleanup(() => clearTimeout(timer));

  const onCreateVendor = () => {
    setOpen(false);
    props.onCreate(searchValue() !== '' ? searchValue()! : props.merchantName!);
    if (searchValue() === '') {
      setSearchValue(props.merchantName!);
    }
  };

  const vendorExists = createMemo(
    () =>
      props.items.filter(
        (supplier) => supplier.supplierName === (searchValue() === '' ? props.merchantName : searchValue()),
      ).length > 0,
  );

  return (
    <div>
      <Popover
        class={css.popover}
        position="bottom-left"
        open={open()}
        onClickOutside={() => setOpen(false)}
        content={
          <div class={css.dropdownContainer}>
            <For each={props.items}>
              {(item) => (
                <div
                  class={css.option}
                  onClick={() => {
                    setOpen(false);
                    setSearchValue(item.supplierName!);
                    props.onSelect(item);
                  }}
                >
                  <Text message={item.supplierName || ''} />
                </div>
              )}
            </For>
            <Show when={!vendorExists()}>
              <div class={css.create} onClick={onCreateVendor}>
                <Icon name="add-circle-outline" size="sm" class={css.icon} />
                <Text message="Create {name}" name={searchValue() !== '' ? searchValue()! : props.merchantName!} />
              </div>
            </Show>
          </div>
        }
      >
        <div onClick={() => setOpen(true)}>
          <Input
            {...props}
            placeholder={String(i18n.t('Select a vendor'))}
            value={searchValue()}
            suffix={<Icon name="search" size="sm" />}
            onChange={onChange}
            data-name="Search"
          />
        </div>
      </Popover>
    </div>
  );
}
