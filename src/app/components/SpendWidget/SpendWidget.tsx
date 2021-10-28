/* eslint-disable @typescript-eslint/no-magic-numbers */

import { LineChart } from '_common/components/Charts/LineChart';
import { formatCurrency } from '_common/api/intl/formatCurrency';

import { Widget } from '../Widget';

import css from './SpendWidget.css';

function random() {
  return (Math.round(Math.random() * 100) % 99) + 1;
}

function getRandomData(count: number = 10) {
  return Array.from(new Array(count)).map(() => random());
}

function getData(count: number) {
  return getRandomData(count).map((value, i) => ({
    id: i.toString(),
    value,
    label: 'Jun 15',
  }));
}

export function SpendWidget() {
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
      <LineChart height={192} data={getData(10)} />
    </Widget>
  );
}
