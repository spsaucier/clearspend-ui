import type { JSXElement } from 'solid-js';
import { createMemo, untrack } from 'solid-js';
import { useI18n } from 'solid-i18n';

import { DateFormat } from '_common/api/intl/types';
import { ILineChartData, LineChart } from '_common/components/Charts';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import type { DashboardGraphData } from 'generated/capital';

import { TimePeriod } from '../../containers/Overview/utils';
import { Widget } from '../Widget';

import css from './SpendWidget.css';

interface SpendWidgetProps {
  period: TimePeriod;
  data: Readonly<DashboardGraphData>;
  controls: JSXElement;
}

export function SpendWidget(props: Readonly<SpendWidgetProps>) {
  const i18n = useI18n();
  const period = createMemo(() => props.period);

  const data = createMemo<readonly ILineChartData[]>(() => {
    return props.data.graphData!.map((item, idx) => {
      return {
        id: String(idx),
        value: item.amount!,
        label: i18n.formatDateTime(
          item.to!,
          untrack(period) === TimePeriod.today ? DateFormat.time : DateFormat.simple,
        ),
      };
    });
  });

  return (
    <Widget
      title="Spend"
      extra={props.controls}
      sub={
        <span class={css.info}>
          <strong class={css.total}>{formatCurrency(props.data.totalSpend!)}</strong>
          &nbsp;
          <span>Avg. {formatCurrency(props.data.averageSpend!)}</span>
        </span>
      }
    >
      <LineChart height={192} data={data()} />
    </Widget>
  );
}
