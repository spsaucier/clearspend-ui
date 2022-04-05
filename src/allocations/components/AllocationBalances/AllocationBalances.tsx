import { createMemo, Show, For } from 'solid-js';
import { Text } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { PieChart } from '_common/components/Charts';
import { getChartColor } from '_common/components/Charts/utils';
import type { Allocation } from 'generated/capital';

import { getAllChildren } from '../../utils/getAllChildren';
import { getAvailableBalance } from '../../utils/getAvailableBalance';
import { getTotalAvailableBalance } from '../../utils/getTotalAvailableBalance';

import type { AllocationData, OtherData } from './types';
import { isAllocationData, getRenderList, calcPieChartData } from './utils';

import css from './AllocationBalances.css';

interface AllocationBalancesProps {
  current: Readonly<Allocation>;
  allocations: readonly Readonly<Allocation>[];
}

export function AllocationBalances(props: Readonly<AllocationBalancesProps>) {
  const items = createMemo<readonly Allocation[]>(() =>
    getAllChildren(props.allocations, props.current, true).sort(
      (a, b) => getAvailableBalance(b) - getAvailableBalance(a),
    ),
  );

  const renderList = createMemo(() => getRenderList(props.allocations, items()));
  const totalBalance = createMemo(() => getTotalAvailableBalance(items()));

  return (
    <section>
      <header>
        <h3 class={css.title}>Balances</h3>
        <div class={css.info}>
          <strong class={css.total}>{formatCurrency(totalBalance())}</strong>
          <Text message="All {name} allocations" name={props.current.name} />
        </div>
      </header>
      <div class={css.wrapper}>
        <Show when={Boolean(totalBalance())}>
          <div class={css.chart}>
            <PieChart size={160} data={calcPieChartData(renderList(), totalBalance())} />
          </div>
        </Show>
        <div class={css.items}>
          <For each={renderList()}>
            {(item, idx) => (
              <div class={css.item}>
                <div class={css.header}>
                  <div class={css.point} style={{ background: getChartColor(idx()) }} />
                  <h4 class={css.name}>
                    <Show when={isAllocationData(item)} fallback={<Text message="Other Allocations" />}>
                      {(item as AllocationData).allocation.name}
                    </Show>
                  </h4>
                </div>
                <strong class={css.amount}>{formatCurrency(item.balance)}</strong>
                <div class={css.children}>
                  <Show
                    when={isAllocationData(item)}
                    fallback={
                      <Text
                        message="{count} other {count, plural, one {allocation} other {allocations}}"
                        count={(item as OtherData).allocations.length}
                      />
                    }
                  >
                    {(item as AllocationData).path}
                  </Show>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
