import { createSignal, For, Show } from 'solid-js';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { PieChart } from '_common/components/Charts';

import { Widget } from '../Widget';
import { TagSelect, TagOption } from '../TagSelect';

import css from './SpendingByWidget.css';

const OPTIONS: readonly Readonly<TagOption>[] = [
  { key: 'alc', text: 'Allocation' },
  { key: 'emp', text: 'Employee' },
  { key: 'mer', text: 'Merchant' },
  { key: 'mca', text: 'Merchant category' },
];

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
  const [type, setType] = createSignal<string>(OPTIONS[0]!.key);

  return (
    <Widget
      title="Spending by"
      class={props.class}
      extra={<TagSelect value={type()} options={OPTIONS} onChange={setType} />}
    >
      <div class={css.content}>
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
        <Show when={type() === 'mca'}>
          <PieChart
            size={160}
            data={[
              { id: '1', percent: 45, color: '#5BEA83' },
              { id: '2', percent: 19, color: '#7CEE9C' },
              { id: '3', percent: 16, color: '#8CF0A8' },
              { id: '4', percent: 11, color: '#9DF2B5' },
              { id: '5', percent: 9, color: '#ADF5C1' },
            ]}
            class={css.chart}
          />
        </Show>
      </div>
    </Widget>
  );
}
