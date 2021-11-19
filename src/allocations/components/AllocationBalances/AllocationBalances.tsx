import { For } from 'solid-js';
import { Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { PieChart } from '_common/components/Charts';

import type { Allocation } from '../../types';

import css from './AllocationBalances.css';

interface AllocationBalancesProps {
  current: Readonly<Allocation>;
  items: readonly Readonly<Allocation>[];
}

export function AllocationBalances(props: Readonly<AllocationBalancesProps>) {
  return (
    <section>
      <header>
        <h3 class={css.title}>Balances</h3>
        <div class={css.info}>
          <strong class={css.total}>{formatCurrency(props.current.account.ledgerBalance.amount)}</strong>
          <Text message="All {name} allocations" name={props.current.name} />
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
          <For each={props.items}>
            {(item) => (
              <div class={css.item}>
                <div class={css.header}>
                  <div class={css.point} />
                  <h4 class={css.name}>{item.name}</h4>
                </div>
                <strong class={css.amount}>{formatCurrency(item.account.ledgerBalance.amount)}</strong>
                <div class={css.children}>
                  <Text
                    message="{count, plural, =0 {No allocations} one {{count} allocation} other {{count} allocations}}"
                    count={item.childrenAllocationIds.length}
                  />
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
