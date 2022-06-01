/* eslint-disable @typescript-eslint/no-magic-numbers */

import { nanoid } from 'nanoid';

import { times } from '_common/utils/times';
import { dateToString, endOfMonth, MONTHS_IN_YEAR, FIRST_DAY_OF_MONTH } from '_common/api/dates';

import { AllocationsSpendingBarChart, type AllocationsSpendingData } from './AllocationsSpendingBarChart';
import { random } from './utils';

export default {
  title: 'Allocations/SpendingBarChart',
  component: AllocationsSpendingBarChart,
  argTypes: {},
  args: {},
};

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

export const Percent = () => (
  <div style={{ 'max-width': '800px' }}>
    <h1 style={{ 'text-align': 'center' }}>Percentage spend per allocation</h1>
    <AllocationsSpendingBarChart percent data={DATA} />
  </div>
);

export const Absolute = () => (
  <div style={{ 'max-width': '800px' }}>
    <h1 style={{ 'text-align': 'center' }}>Total spend</h1>
    <AllocationsSpendingBarChart data={DATA} />
  </div>
);
