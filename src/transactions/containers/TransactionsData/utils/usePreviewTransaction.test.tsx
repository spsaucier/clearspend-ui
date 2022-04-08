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

  assert.is(result[0](), undefined);
  assert.is(result[1](), undefined);

  result[2]('a');
  assert.equal(result[0](), 'a');
  assert.equal(result[1](), { accountActivityId: 'a' });

  result[2]();
  assert.is(result[0](), undefined);
  assert.is(result[1](), undefined);

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

  result[2]('c');
  assert.equal(result[0](), 'c');
  assert.is(result[1](), undefined);

  signal[1]([{ accountActivityId: 'c' }]);
  assert.equal(result[1](), { accountActivityId: 'c' });

  dispose();
});

test.run();
