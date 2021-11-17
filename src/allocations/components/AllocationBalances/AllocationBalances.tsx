import { For } from 'solid-js';
import { Text } from 'solid-i18n';

import { times } from '_common/utils/times';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { PieChart } from '_common/components/Charts';

import css from './AllocationBalances.css';

export function AllocationBalances() {
  return (
    <section>
      <header>
        <h3 class={css.title}>Balances</h3>
        <div class={css.info}>
          {/* eslint-disable-next-line @typescript-eslint/no-magic-numbers */}
          <strong class={css.total}>{formatCurrency(40802.93)}</strong>
          <Text message="All {name} allocations" name="[Name]" />
        </div>
      </header>
      <div class={css.wrapper}>
        <div class={css.chart}>
          <PieChart
            size={160}
            data={[
              { id: '1', percent: 45, color: '#5BEA83' },
              { id: '2', percent: 19, color: '#7CEE9C' },
              { id: '3', percent: 16, color: '#8CF0A8' },
              { id: '4', percent: 11, color: '#9DF2B5' },
              { id: '5', percent: 9, color: '#ADF5C1' },
            ]}
          />
        </div>
        <div class={css.items}>
          {/* eslint-disable-next-line @typescript-eslint/no-magic-numbers */}
          <For each={times(6)}>
            {() => (
              <div class={css.item}>
                <div class={css.header}>
                  <div class={css.point} />
                  <h4 class={css.name}>[Name]</h4>
                </div>
                <strong class={css.amount}>[$999.99]</strong>
                <div class={css.children}>[Names]</div>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
