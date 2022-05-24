import { createMemo } from 'solid-js';
import { Text } from 'solid-i18n';

import { SwitchGroupBox } from 'app/components/SwitchGroupBox';
import { MERCHANT_CATEGORIES } from 'transactions/constants';
import type { MccGroup } from 'transactions/types';

interface SwitchMccCategoriesProps {
  value: readonly string[];
  items: readonly Readonly<MccGroup>[];
  class?: string;
  disabled?: boolean;
  onChange: (value: string[]) => void;
}

export function SwitchMccCategories(props: Readonly<SwitchMccCategoriesProps>) {
  const items = createMemo(() => props.items.map((item) => ({ key: item, ...MERCHANT_CATEGORIES[item] })));

  return (
    <SwitchGroupBox
      name="mcc-categories"
      value={props.value}
      allTitle={<Text message="All categories" />}
      items={items()}
      class={props.class}
      disabled={props.disabled}
      onChange={props.onChange}
    />
  );
}
