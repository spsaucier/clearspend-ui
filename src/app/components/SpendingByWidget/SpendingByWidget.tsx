import { For, Show } from 'solid-js';
import { Text } from 'solid-i18n';

import { useNav } from '_common/api/router';
import { formatName } from 'employees/utils/formatName';
import { formatMerchantType } from 'transactions/utils/formatMerchantType';

import type { ChartDataResponse } from '../../types/spending';

import { WidgetCard } from './components/WidgetCard';
import { NumberedItem } from './components/NumberedItem';
import { Merchant } from './components/Merchant';

import css from './SpendingByWidget.css';

interface SpendingByWidgetProps {
  data: Readonly<ChartDataResponse>;
}

export function SpendingByWidget(props: Readonly<SpendingByWidgetProps>) {
  const navigate = useNav();

  return (
    <div class={css.root}>
      <Show when={Boolean(props.data.merchantChartData.length)}>
        <WidgetCard title={<Text message="Merchant" />}>
          <For each={props.data.merchantChartData}>
            {(item) => <Merchant merchant={item.merchant!} amount={item.amount!} />}
          </For>
        </WidgetCard>
      </Show>
      <Show when={Boolean(props.data.merchantCategoryChartData.length)}>
        <WidgetCard title={<Text message="Merchant category" />}>
          <For each={props.data.merchantCategoryChartData}>
            {(item, idx) => (
              <NumberedItem num={idx() + 1} name={formatMerchantType(item.merchantType)} amount={item.amount!} />
            )}
          </For>
        </WidgetCard>
      </Show>
      <Show when={Boolean(props.data.userChartData.length)}>
        <WidgetCard title={<Text message="Employee" />}>
          <For each={props.data.userChartData}>
            {(item, idx) => (
              <NumberedItem
                num={idx() + 1}
                name={formatName(item.user!)}
                amount={item.amount!}
                onClick={item.user?.userId ? () => navigate(`/employees/view/${item.user!.userId}`) : undefined}
              />
            )}
          </For>
        </WidgetCard>
      </Show>
      <Show when={Boolean(props.data.allocationChartData.length)}>
        <WidgetCard title={<Text message="Allocation" />}>
          <For each={props.data.allocationChartData}>
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
        </WidgetCard>
      </Show>
    </div>
  );
}
