import { createMemo, For, Show, Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';

import { i18n } from '_common/api/intl';
import { useNav } from '_common/api/router';
import { PieChart } from '_common/components/Charts';
import { getChartColor } from '_common/components/Charts/utils';
import { Loading } from 'app/components/Loading';
import { formatName } from 'employees/utils/formatName';
import type { ChartDataRequest, ChartDataResponse } from 'generated/capital';

import { Widget } from '../Widget';
import { TagSelect, TagOption } from '../TagSelect';

import { NumberedItem } from './components/NumberedItem';
import { Merchant } from './components/Merchant';
import { MerchantCategory } from './components/MerchantCategory';
import { sortByAmount, calcPieChartData } from './utils';

import css from './SpendingByWidget.css';

const OPTIONS: readonly Readonly<TagOption>[] = [
  { key: 'ALLOCATION', text: i18n.t('Allocation') },
  { key: 'EMPLOYEE', text: i18n.t('Employee') },
  { key: 'MERCHANT', text: i18n.t('Merchant') },
  { key: 'MERCHANT_CATEGORY', text: i18n.t('Merchant category') },
];

interface SpendingByWidgetProps {
  loading: boolean;
  data: Readonly<ChartDataResponse>;
  params: Readonly<ChartDataRequest>;
  class?: string;
  onFilterChange: (value: string) => void;
}

export function SpendingByWidget(props: Readonly<SpendingByWidgetProps>) {
  const navigate = useNav();

  const data = createMemo(() => {
    if (props.params.chartFilter === 'ALLOCATION') return props.data.allocationChartData || [];
    if (props.params.chartFilter === 'EMPLOYEE') return props.data.userChartData || [];
    if (props.params.chartFilter === 'MERCHANT') return props.data.merchantChartData || [];
    return props.data.merchantCategoryChartData || [];
  });

  return (
    <Widget
      title="Spending by"
      class={props.class}
      extra={
        <TagSelect
          value={props.params.chartFilter}
          options={OPTIONS}
          class={css.fullWidthDropdown}
          onChange={props.onFilterChange}
        />
      }
    >
      <div class={css.content} classList={{ [css.withChart!]: props.params.chartFilter === 'MERCHANT_CATEGORY' }}>
        <Show when={!props.loading} fallback={<Loading />}>
          <Show when={data().length} fallback={<Text message="There is no data for this period" class={css.empty!} />}>
            <ol class={css.list}>
              <Switch>
                <Match when={props.params.chartFilter === 'ALLOCATION'}>
                  <For each={sortByAmount(props.data.allocationChartData || [])}>
                    {(item, idx) => (
                      <NumberedItem
                        num={idx() + 1}
                        name={item.allocation!.name!}
                        amount={item.amount!}
                        onClick={
                          item.allocation?.allocationId
                            ? () => navigate(`/allocations/${item.allocation!.allocationId}`)
                            : undefined
                        }
                      />
                    )}
                  </For>
                </Match>
                <Match when={props.params.chartFilter === 'EMPLOYEE'}>
                  <For each={sortByAmount(props.data.userChartData || [])}>
                    {(item, idx) => (
                      <NumberedItem
                        num={idx() + 1}
                        name={formatName(item.user!)}
                        amount={item.amount!}
                        onClick={item.user?.userId ? () => navigate(`/employees/view/${item.user!.userId}`) : undefined}
                      />
                    )}
                  </For>
                </Match>
                <Match when={props.params.chartFilter === 'MERCHANT'}>
                  <For each={sortByAmount(props.data.merchantChartData || [])}>
                    {(item) => <Merchant merchant={item.merchant!} amount={item.amount!} />}
                  </For>
                </Match>
                <Match when={props.params.chartFilter === 'MERCHANT_CATEGORY'}>
                  <For each={sortByAmount(props.data.merchantCategoryChartData || [])}>
                    {(item, idx) => (
                      <MerchantCategory color={getChartColor(idx())} type={item.merchantType} amount={item.amount!} />
                    )}
                  </For>
                </Match>
              </Switch>
            </ol>
            <Show when={props.params.chartFilter === 'MERCHANT_CATEGORY'}>
              <PieChart
                size={160}
                data={calcPieChartData(sortByAmount(props.data.merchantCategoryChartData || []))}
                class={css.chart}
              />
            </Show>
          </Show>
        </Show>
      </div>
    </Widget>
  );
}
