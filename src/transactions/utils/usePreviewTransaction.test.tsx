import { suite } from 'uvu';
import { snoop } from 'snoop';
import { createSignal, type Signal } from 'solid-js';
import * as assert from 'uvu/assert';

import { updates, createRootWithProviders, getLocationController } from 'app/utils/testing';
import type { AccountActivityResponse } from 'generated/capital';

import { usePreviewTransaction } from './usePreviewTransaction';

const test = suite('usePreviewTransaction');

const A: AccountActivityResponse = { accountActivityId: 'a' };
const B: AccountActivityResponse = { accountActivityId: 'b' };
const C: AccountActivityResponse = { accountActivityId: 'c' };
const Z: AccountActivityResponse = { accountActivityId: 'z' };

const transactions: AccountActivityResponse[] = [A, B];

const fetchData = (): Promise<AccountActivityResponse> => Promise.resolve(Z);

test('it should return correct id and data for items from preloaded list', () => {
  let result!: ReturnType<typeof usePreviewTransaction>;

  const dispose = createRootWithProviders(() => {
    result = usePreviewTransaction(() => transactions, fetchData);
    return null;
  });

  assert.is(result.id(), undefined);
  assert.is(result.transaction(), undefined);

  result.changeID(A.accountActivityId);
  assert.equal(result.id(), A.accountActivityId);
  assert.equal(result.transaction(), A);

  result.changeID();
  assert.is(result.id(), undefined);
  assert.is(result.transaction(), undefined);

  dispose();
});

test('it should update the returned data after transaction updates', () => {
  let signal!: Signal<AccountActivityResponse[]>;
  let result!: ReturnType<typeof usePreviewTransaction>;

  const dispose = createRootWithProviders(() => {
    signal = createSignal(transactions);
    result = usePreviewTransaction(signal[0], fetchData);
    return null;
  });

  result.changeID(C.accountActivityId);
  assert.equal(result.id(), C.accountActivityId);
  assert.is(result.transaction(), undefined);

  signal[1]([C]);
  assert.equal(result.transaction(), C);

  result.changeID();
  dispose();
});

test('it should use fetch transaction function', async () => {
  const locationController = getLocationController();
  locationController.replace({ search: '?transaction=z' });

  let result!: ReturnType<typeof usePreviewTransaction>;
  const fetcher = snoop(fetchData);

  const dispose = createRootWithProviders(() => {
    result = usePreviewTransaction(() => transactions, fetcher.fn);
    return null;
  });

  assert.ok(fetcher.called);
  assert.is(result.id(), undefined);
  assert.is(result.transaction(), undefined);

  await updates();
  assert.is(result.id(), Z.accountActivityId);
  assert.equal(result.transaction(), Z);

  result.changeID();
  locationController.restore();
  dispose();
});

test.run();
