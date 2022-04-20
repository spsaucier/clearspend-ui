import { suite } from 'uvu';
import { createSignal, type Signal } from 'solid-js';
import * as assert from 'uvu/assert';

import { createRootWithProviders } from 'app/utils/testing';
import type { AccountActivityResponse } from 'generated/capital';

import { usePreviewTransaction } from './usePreviewTransaction';

const test = suite('usePreviewTransaction');

const transactions: AccountActivityResponse[] = [{ accountActivityId: 'a' }, { accountActivityId: 'b' }];

// TODO: write tests for /?transaction=z
const fetchData = (): Promise<AccountActivityResponse> => Promise.resolve({ accountActivityId: 'z' });

test('it returns correct id and data for items from preloaded list', () => {
  let result!: ReturnType<typeof usePreviewTransaction>;

  const dispose = createRootWithProviders(() => {
    result = usePreviewTransaction(() => transactions, fetchData);
    return null;
  });

  assert.is(result.id(), undefined);
  assert.is(result.transaction(), undefined);

  result.changeID('a');
  assert.equal(result.id(), 'a');
  assert.equal(result.transaction(), { accountActivityId: 'a' });

  result.changeID();
  assert.is(result.id(), undefined);
  assert.is(result.transaction(), undefined);

  dispose();
});

test('', () => {
  let signal!: Signal<AccountActivityResponse[]>;
  let result!: ReturnType<typeof usePreviewTransaction>;

  const dispose = createRootWithProviders(() => {
    signal = createSignal(transactions);
    result = usePreviewTransaction(signal[0], fetchData);
    return null;
  });

  result.changeID('c');
  assert.equal(result.id(), 'c');
  assert.is(result.transaction(), undefined);

  signal[1]([{ accountActivityId: 'c' }]);
  assert.equal(result.transaction(), { accountActivityId: 'c' });

  dispose();
});

test.run();
