/* eslint-disable @typescript-eslint/no-magic-numbers */

import type { ILineChartData } from '_common/components/Charts';

function random() {
  return (Math.round(Math.random() * 100) % 99) + 1;
}

function getRandomData(count: number = 10) {
  return Array.from(new Array(count)).map(() => random());
}

export function getLineData(count: number = 10): readonly ILineChartData[] {
  return getRandomData(count).map((value, i) => ({
    id: i.toString(),
    value,
    label: 'Jun 15',
  }));
}
