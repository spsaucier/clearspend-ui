import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { createRoot, createSignal, type Setter } from 'solid-js';

import type { AccountActivityRequest } from 'generated/capital';
import { updates } from 'app/utils/testing';

import { DEFAULT_ACTIVITY_PARAMS } from '../constants';

import { useTransactionsFilters } from './useTransactionsFilters';

const test = suite('useTransactionsFilters');

const DEFAULT_FILTERS: AccountActivityRequest = {
  ...DEFAULT_ACTIVITY_PARAMS,
  from: undefined,
  to: undefined,
};

test('it should return the correct initial state', async () => {
  let dispose!: () => void;
  let filters!: ReturnType<typeof useTransactionsFilters>;

  createRoot((d) => {
    dispose = d;
    const [params, setParams] = createSignal<AccountActivityRequest>(DEFAULT_ACTIVITY_PARAMS);
    filters = useTransactionsFilters(params, undefined, setParams);
  });

  assert.is(filters.showFilters(), false);
  assert.is(filters.filtersCount(), 0);
  assert.equal(filters.filters(), DEFAULT_FILTERS);

  dispose();
});

test('it should handle open filters state', async () => {
  let dispose!: () => void;
  let filters!: ReturnType<typeof useTransactionsFilters>;

  createRoot((d) => {
    dispose = d;
    const [params, setParams] = createSignal<AccountActivityRequest>(DEFAULT_ACTIVITY_PARAMS);
    filters = useTransactionsFilters(params, undefined, setParams);
  });

  filters.toggleFilters();
  await updates();
  assert.is(filters.showFilters(), true);

  filters.toggleFilters();
  await updates();
  assert.is(filters.showFilters(), false);

  dispose();
});

test('it should handle params changes', async () => {
  let dispose!: () => void;
  let filters!: ReturnType<typeof useTransactionsFilters>;
  let update!: Setter<AccountActivityRequest>;

  createRoot((d) => {
    dispose = d;
    const [params, setParams] = createSignal<AccountActivityRequest>(DEFAULT_ACTIVITY_PARAMS);
    filters = useTransactionsFilters(params, undefined, setParams);
    update = setParams;
  });

  const changes: Partial<AccountActivityRequest> = { userId: 'foo', withReceipt: true };
  update((prev) => ({ ...prev, ...changes }));

  await updates();
  assert.is(filters.filtersCount(), Object.keys(changes).length);
  assert.equal(filters.filters(), { ...DEFAULT_FILTERS, ...changes });

  dispose();
});

test('it should handle filters changes', async () => {
  let dispose!: () => void;
  let filters!: ReturnType<typeof useTransactionsFilters>;

  createRoot((d) => {
    dispose = d;
    const [params, setParams] = createSignal<AccountActivityRequest>(DEFAULT_ACTIVITY_PARAMS);
    filters = useTransactionsFilters(params, undefined, setParams);
  });

  const changes: Partial<AccountActivityRequest> = { userId: 'foo', withReceipt: true };
  filters.onChangeFilters((prev) => ({ ...prev, ...changes }));

  await updates();
  assert.is(filters.filtersCount(), Object.keys(changes).length);
  assert.equal(filters.filters(), { ...DEFAULT_FILTERS, ...changes });

  filters.onResetFilters();

  await updates();
  assert.is(filters.filtersCount(), 0);
  assert.equal(filters.filters(), {
    ...DEFAULT_FILTERS,
    userId: undefined,
    withReceipt: undefined,
    withoutReceipt: undefined,
    amount: undefined,
    categories: undefined,
    syncStatus: undefined,
    statuses: undefined,
    types: undefined,
  });

  dispose();
});

test.run();
