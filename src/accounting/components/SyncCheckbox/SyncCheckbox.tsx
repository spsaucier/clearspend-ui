import { createMemo } from 'solid-js';

import { toSortedString } from '_common/utils/array';
import { Checkbox } from '_common/components/Checkbox';
import type { AccountActivityResponse } from 'generated/capital';

interface SyncCheckboxProps {
  selected: string[];
  items: readonly Readonly<AccountActivityResponse>[] | undefined;
  class?: string;
  onChange: (ids: string[]) => void;
}

export function SyncCheckbox(props: Readonly<SyncCheckboxProps>) {
  const availableIds = createMemo(() =>
    (props.items || []).filter((item) => item.syncStatus === 'READY').map((item) => item.accountActivityId!),
  );

  const checked = createMemo(() => toSortedString(availableIds()) === toSortedString(props.selected));

  return (
    <Checkbox
      checked={checked()}
      indeterminate={Boolean(props.selected.length) && !checked()}
      class={props.class}
      onChange={(value) => props.onChange(value ? [...availableIds()] : [])}
    />
  );
}
