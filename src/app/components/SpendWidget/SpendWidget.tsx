/* eslint-disable @typescript-eslint/no-magic-numbers */

import { LineChart, ILineChartData } from '_common/components/Charts';
import { formatCurrency } from '_common/api/intl/formatCurrency';

import { Widget } from '../Widget';

import css from './SpendWidget.css';

interface SpendWidgetProps {
  data: readonly Readonly<ILineChartData>[];
}

export function SpendWidget(props: Readonly<SpendWidgetProps>) {
  return (
    <Widget
      title="Spend"
      sub={
        <span class={css.info}>
          <strong class={css.total}>{formatCurrency(4570.04)}</strong>
          &nbsp;
          <span>Avg. {formatCurrency(914)}</span>
        </span>
      }
    >
      <LineChart height={192} data={props.data} />
    </Widget>
  );
}
