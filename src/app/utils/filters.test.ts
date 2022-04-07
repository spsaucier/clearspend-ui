import { suite } from 'uvu';
import * as assert from 'uvu/assert';

import { getAmountFilter, toFilterAmount, getDateFilter, toFilterDate, toFilterArray } from './filters';

const test = suite('app/utils/filters');

test('getAmountFilter', () => {
  assert.equal(getAmountFilter(undefined), { amountMin: '', amountMax: '' });
  assert.equal(getAmountFilter({}), { amountMin: '', amountMax: '' });
  assert.equal(getAmountFilter({ min: 0 }), { amountMin: '0', amountMax: '' });
  assert.equal(getAmountFilter({ max: 10 }), { amountMin: '', amountMax: '10' });
  assert.equal(getAmountFilter({ min: 0, max: 10.6 }), { amountMin: '0', amountMax: '10.6' });
});

test('toFilterAmount', () => {
  assert.equal(toFilterAmount({ amountMin: '', amountMax: '' }), false);
  assert.equal(toFilterAmount({ amountMin: '10', amountMax: '' }), { min: 10, max: undefined });
  assert.equal(toFilterAmount({ amountMin: '', amountMax: '99.9' }), { min: undefined, max: 99.9 });
});

const DATE_FROM = '2022-02-28T17:00:00.000Z';
const DATE_TO = '2022-03-28T17:00:00.000Z';

test('getDateFilter', () => {
  assert.equal(getDateFilter({ from: '' }), []);
  assert.equal(getDateFilter({ from: '', to: '' }), []);
  assert.equal(getDateFilter({ from: DATE_FROM, to: DATE_TO }), [new Date(DATE_FROM), new Date(DATE_TO)]);
});

test('toFilterDate', () => {
  assert.equal(toFilterDate([]), { from: undefined, to: undefined });
  assert.equal(toFilterDate([new Date(DATE_FROM), new Date(DATE_TO)]), { from: DATE_FROM, to: DATE_TO });
});

test('toFilterArray', () => {
  assert.equal(toFilterArray([]), undefined);
  assert.equal(toFilterArray([1]), [1]);
  assert.equal(toFilterArray([1, 1]), [1, 1]);
});

test.run();
