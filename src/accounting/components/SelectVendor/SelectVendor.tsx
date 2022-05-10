import { createSignal, For } from 'solid-js';
import { Text } from 'solid-i18n';

import { InputSearch } from '_common/components/InputSearch';
import { i18n } from '_common/api/intl';
import { Popover } from '_common/components/Popover';
import type { CodatSupplier } from 'generated/capital';
import { Icon } from '_common/components/Icon';

import css from './SelectVendor.css';

interface SelectVendorProps {
  defaultSearchName: string;
  onChangeTarget: (target: string) => void;
  items: CodatSupplier[];
  onSelect: (supplier: CodatSupplier) => void;
  value: string | undefined;
  onCreate: (supplierName: string) => void;
}

export function SelectVendor(props: Readonly<SelectVendorProps>) {
  const [open, setOpen] = createSignal(false);
  const [searchValue, setSearchValue] = createSignal(props.value);

  const onChangeSearch = (value: string) => {
    setSearchValue(value);
    props.onChangeTarget(value);
  };

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
                    props.onSelect(item);
                  }}
                >
                  <Text message={item.supplierName || ''} />
                </div>
              )}
            </For>
            <div
              class={css.create}
              onClick={() => {
                setOpen(false);
                props.onCreate(searchValue() !== '' ? searchValue()! : props.value!);
              }}
            >
              <Icon name="add-circle-outline" size="sm" class={css.icon} />
              <Text message="Create {name}" name={searchValue() !== '' ? searchValue()! : props.value!} />
            </div>
          </div>
        }
      >
        <div onClick={() => setOpen(true)}>
          <InputSearch
            delay={400}
            placeholder={String(i18n.t('Select a vendor'))}
            onSearch={onChangeSearch}
            value={props.value}
          />
        </div>
      </Popover>
    </div>
  );
}
