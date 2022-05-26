/* eslint-disable @typescript-eslint/no-magic-numbers */

import { nanoid } from 'nanoid';

import { times } from '_common/utils/times';
import { dateToString, endOfMonth, MONTHS_IN_YEAR, FIRST_DAY_OF_MONTH } from '_common/api/dates';

import { AllocationsSpendingBarChart, type AllocationsSpendingData } from './AllocationsSpendingBarChart';

export default {
  title: 'Allocations/SpendingBarChart',
  component: AllocationsSpendingBarChart,
  argTypes: {},
  args: {},
};

export function random(min: number, max: number) {
  return Math.round(min - 0.5 + Math.random() * (max - min + 1));
}

const DATA: readonly Readonly<AllocationsSpendingData>[] = times(MONTHS_IN_YEAR).map((_, idx) => {
  const from = new Date(2021, idx, FIRST_DAY_OF_MONTH);

  return {
    from: dateToString(from),
    to: dateToString(endOfMonth(from)),
    spending: ['Marketing', 'Office Operations', 'Sales'].map((allocationName) => ({
      allocationName,
      allocationId: nanoid(),
      amount: { amount: random(990, 1000000) / 100, currency: 'USD' },
    })),
  };
});

export const Default = () => (
  <div style={{ 'max-width': '800px' }}>
    <AllocationsSpendingBarChart data={DATA} />
  </div>
);
