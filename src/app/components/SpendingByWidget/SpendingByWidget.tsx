import { For } from 'solid-js';

import { Tag } from '_common/components/Tag';
import { Icon } from '_common/components/Icon';
import { formatCurrency } from '_common/api/intl/formatCurrency';

import { Widget } from '../Widget';

import css from './SpendingByWidget.css';

const MOCK = [
  { name: 'North Valley Enterprises', amount: 500 },
  { name: 'Marketing', amount: 500 },
  { name: 'Sales', amount: 300 },
  { name: 'Q4 Ad Campaign', amount: 200 },
  { name: 'Holiday Party', amount: 100 },
];

interface SpendingByWidgetProps {
  class?: string;
}

export function SpendingByWidget(props: Readonly<SpendingByWidgetProps>) {
  return (
    <Widget
      title="Spending by"
      class={props.class}
      extra={
        <Tag size="sm">
          <span class={css.tag}>
            <span>Allocation</span>
            <Icon size="sm" name="chevron-down" />
          </span>
        </Tag>
      }
    >
      <ol class={css.list}>
        <For each={MOCK}>
          {(item, idx) => (
            <li class={css.item}>
              <span class={css.num}>{idx() + 1}.</span>
              <span class={css.title}>{item.name}</span>
              <span class={css.amount}>{formatCurrency(item.amount)}</span>
            </li>
          )}
        </For>
      </ol>
    </Widget>
  );
}
