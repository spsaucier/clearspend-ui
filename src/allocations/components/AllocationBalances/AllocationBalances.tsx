import { Show, For } from 'solid-js';
import { Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { PieChart } from '_common/components/Charts';
import { getChartColor } from '_common/components/Charts/utils';
import type { Allocation } from 'generated/capital';

import { calcPieChartData } from './utils';

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
          <strong class={css.total}>{formatCurrency(props.current.account.availableBalance?.amount || 0)}</strong>
          <Text message="All {name} allocations" name={props.current.name} />
        </div>
      </header>
      <div class={css.wrapper}>
        <Show when={Boolean(props.current.account.availableBalance?.amount || 0)}>
          <div class={css.chart}>
            <PieChart size={160} data={calcPieChartData(props.items)} />
          </div>
        </Show>
        <div class={css.items}>
          <For each={props.items}>
            {(item, idx) => (
              <div class={css.item}>
                <div class={css.header}>
                  <div class={css.point} style={{ background: getChartColor(idx()) }} />
                  <h4 class={css.name}>{item.name}</h4>
                </div>
                <strong class={css.amount}>{formatCurrency(item.account.availableBalance?.amount || 0)}</strong>
                <div class={css.children}>
                  <Text
                    message="{count, plural, =0 {No allocations} one {{count} allocation} other {{count} allocations}}"
                    count={item.childrenAllocationIds?.length || 0}
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
