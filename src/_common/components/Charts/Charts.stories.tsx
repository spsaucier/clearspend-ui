/* eslint-disable @typescript-eslint/no-magic-numbers */

import { Show } from 'solid-js';

import { getChartColor } from './utils';

import { LineChart, BarChart, PieChart } from './index';
import type { ILineChartData, IBarChartData, IPieChartData } from './index';

export default {
  title: 'Common/Charts',
  component: null,
  argTypes: {},
  args: {},
};

const LINE_CHART_DATA: ILineChartData[] = [
  { id: '1', value: 3599.99, label: '2009' },
  { id: '2', value: 2333.99, label: '2010' },
  { id: '3', value: 13800.99, label: '2011' },
  { id: '4', value: 6599.99, label: '2012' },
  { id: '5', value: 7599.99, label: '2013' },
  { id: '6', value: 9999.0, label: '2014' },
  { id: '7', value: 3599.99, label: '2015' },
  { id: '8', value: 6666.99, label: '2016' },
  { id: '9', value: 10099.99, label: '2017' },
  { id: '10', value: 8799.99, label: '2018' },
  { id: '11', value: 9599.99, label: '2019' },
  { id: '12', value: 3599.99, label: '2020' },
];

export const Line = () => (
  <div style={{ 'max-width': '600px' }}>
    <LineChart height={200} data={LINE_CHART_DATA} />
  </div>
);

const BAR_CHART_COLORS = ['#01c88d', '#faa93d', '#ffd32e', '#ffcd00', '#d3d3d3'];
const BAR_CHART_DATA: IBarChartData[] = [
  { id: '0', values: [40, 6, 39, 12, 2], label: 'Jan' },
  { id: '1', values: [42, 13, 16, 24, 2], label: 'Feb' },
  { id: '2', values: [20, 4, 10, 51, 9], label: 'Mar' },
  { id: '3', values: [13, 52, 0, 3, 12], label: 'Apr' },
  { id: '4', values: [37, 13, 14, 5, 31], label: 'May' },
  { id: '5', values: [54, 19, 11, 2, 5], label: 'Jun' },
  { id: '6', values: [80, 16, 2, 1, 0], label: 'Jul' },
  { id: '7', values: [20, 32, 21, 27, 0], label: 'Aug' },
  { id: '8', values: [100, 0, 0, 0, 0], label: 'Sep' },
  { id: '9', values: [87, 5, 3, 0, 5], label: 'Oct' },
  { id: '10', values: [81, 8, 0, 7, 0], label: 'Nov' },
  { id: '11', values: [72, 12, 6, 7, 0], label: 'Dec' },
];

export const Bar = () => (
  <div style={{ 'max-width': '600px' }}>
    <BarChart stacked height={200} colors={BAR_CHART_COLORS} data={BAR_CHART_DATA} />
  </div>
);

const PIE_CHART_DATA: IPieChartData[] = [45, 19, 16, 10, 9, 1].map((value, idx) => ({
  id: idx.toString(),
  percent: value,
  color: getChartColor(idx),
}));

export const Pie = () => (
  <div>
    <PieChart size={160} data={PIE_CHART_DATA}>
      {(id) => {
        const currentData = PIE_CHART_DATA.find((item) => item.id === id);
        return <Show when={currentData}>{(data) => <div>{data.percent}%</div>}</Show>;
      }}
    </PieChart>
  </div>
);
