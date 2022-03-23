import { For, Show } from 'solid-js';

import { i18n } from '_common/api/intl';
import { useNav } from '_common/api/router';
import type { ChartDataResponse } from 'generated/capital';
import { formatName } from 'employees/utils/formatName';

import { sortByAmount } from './utils';
import { NumberedItem } from './components/NumberedItem';
import { Merchant } from './components/Merchant';
import { MerchantCategory } from './components/MerchantCategory';

import css from './SpendingByWidget.css';

interface SpendingByWidgetProps {
  data: Readonly<ChartDataResponse>;
  class?: string;
}

export function SpendingByWidget(props: Readonly<SpendingByWidgetProps>) {
  const navigate = useNav();
  return (
    <div>
      <div class={css.topCardWrapper}>
        <Show when={props.data.merchantChartData && props.data.merchantChartData.length > 0}>
          <div class={css.categoryCard}>
            <div class={css.cardTitle}>{i18n.t('Merchant')}</div>
            <For each={sortByAmount(props.data.merchantChartData || [])}>
              {(item) => <Merchant merchant={item.merchant!} amount={item.amount!} />}
            </For>
          </div>
        </Show>
        <Show when={props.data.merchantCategoryChartData && props.data.merchantCategoryChartData.length > 0}>
          <div class={css.categoryCard}>
            <div class={css.cardTitle}>{i18n.t('Merchant category')}</div>
            <For each={sortByAmount(props.data.merchantCategoryChartData || [])}>
              {(item) => <MerchantCategory type={item.merchantType} amount={item.amount!} />}
            </For>
          </div>
        </Show>
        <Show when={props.data.userChartData && props.data.userChartData.length > 0}>
          <div class={css.categoryCard}>
            <div class={css.cardTitle}>{i18n.t('Employee')}</div>
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
          </div>
        </Show>
        <Show when={props.data.allocationChartData && props.data.allocationChartData.length > 0}>
          <div class={css.categoryCard}>
            <div class={css.cardTitle}>{i18n.t('Allocation')}</div>
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
          </div>
        </Show>
      </div>
    </div>
  );
}
