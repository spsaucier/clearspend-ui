import { createSignal, createMemo, For, Show } from 'solid-js';
import { Portal } from 'solid-js/web';
import { useI18n } from 'solid-i18n';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { BarChart, type IBarChartData, type IBarHoverData } from '_common/components/Charts';
import type { Amount } from 'generated/capital';

import css from './AllocationsSpendingBarChart.css';

const TOTAL_PERCENT = 100;
const COLORS = ['#01c88d', '#faa93d', '#ffd32e'];
const LIST_COLORS = [...COLORS].reverse();

interface TooltipData {
  x: number;
  y: number;
  name: string;
  percent: number;
  amount: Required<Amount>;
}

interface SpendingData {
  allocationId: string;
  allocationName: string;
  amount: Required<Amount>;
}

export interface AllocationsSpendingData {
  from: string;
  to: string;
  spending: readonly Readonly<SpendingData>[];
}

interface AllocationsSpendingBarChartProps {
  data: readonly Readonly<AllocationsSpendingData>[];
}

export function AllocationsSpendingBarChart(props: Readonly<AllocationsSpendingBarChartProps>) {
  const i18n = useI18n();

  const [tooltip, setTooltip] = createSignal<Readonly<TooltipData>>();

  const chartData = createMemo<IBarChartData[]>(() => {
    const maxAmount = Math.ceil(
      props.data.reduce((res, curr) => {
        return Math.max(res, ...curr.spending.map((spending) => spending.amount.amount));
      }, 0),
    );

    return props.data.map((item, idx) => {
      return {
        id: idx.toString(),
        label: i18n.formatDateTime(item.from, { month: 'short' }),
        values: item.spending.map((spending) => (spending.amount.amount * TOTAL_PERCENT) / maxAmount),
      };
    });
  });

  const onHover = (value?: IBarHoverData<Readonly<IBarChartData>>) => {
    const idx = value?.dataIndex;

    if (!value || idx === undefined) {
      setTooltip(undefined);
      return;
    }

    const data = props.data[parseInt(value.data.id, 10)]!.spending[idx]!;

    setTooltip({
      x: value.clientX,
      y: value.clientY,
      name: data.allocationName,
      percent: value.data.values[idx]!,
      amount: data.amount,
    });
  };

  return (
    <div class={css.root}>
      <ul class={css.list}>
        <For each={[...(props.data[0]?.spending || [])].reverse()}>
          {(item, idx) => (
            <li class={css.item}>
              <span class={css.point} style={{ 'background-color': LIST_COLORS[idx()] }} />
              {item.allocationName}
            </li>
          )}
        </For>
      </ul>
      <BarChart stacked height={260} barWidth={18} data={chartData()} colors={COLORS} onHover={onHover} />
      <Show when={tooltip()}>
        {(data) => (
          <Portal>
            <div class={css.tooltip} style={{ transform: `translate3d(${data.x}px, ${data.y}px, 0)` }}>
              <div class={css.tooltipContent}>
                <strong>{data.name}</strong>
                <div>
                  {formatCurrency(data.amount.amount)} ({i18n.formatNumber(data.percent)}%)
                </div>
              </div>
            </div>
          </Portal>
        )}
      </Show>
    </div>
  );
}
