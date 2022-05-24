/* eslint-disable @typescript-eslint/no-magic-numbers */

import { suite } from 'uvu';
import { snoop } from 'snoop';
import { createRoot, createSignal, type Signal } from 'solid-js';
import * as assert from 'uvu/assert';

import { create, type Store } from './store';
import { cloneObject } from './cloneObject';
import { wait } from './wait';
import { getNoop } from './getNoop';

const test = suite('Store');

test('is should have expected structure', () => {
  let dispose!: () => void;
  let store!: Store<void, unknown>;

  createRoot((d) => {
    dispose = d;
    store = create(() => Promise.resolve())();
  });

  assert.equal(
    { ...store },
    {
      loading: true,
      error: null,
      data: null,
      params: null,
      reload: store.reload,
      setData: store.setData,
      setParams: store.setParams,
    },
  );

  dispose();
});

test('it should update loading state', async () => {
  let dispose!: () => void;
  let store!: Store<boolean, unknown>;

  createRoot((d) => {
    dispose = d;
    store = create(() => Promise.resolve(true))();
  });

  assert.ok(store.loading);

  await wait(0);
  assert.not(store.loading);
  const reload = store.reload();
  assert.ok(store.loading);

  await reload;
  assert.not(store.loading);

  dispose();
});

test('it should update error state', async () => {
  let dispose!: () => void;
  let store!: Store<never, unknown>;

  createRoot((d) => {
    dispose = d;
    store = create(() => Promise.reject(new Error()))();
  });

  assert.not(store.error);

  await wait(0);
  assert.ok(store.error);

  dispose();
});

test('it should fetch & update data', async () => {
  let dispose!: () => void;
  let store!: Store<number[], unknown>;

  const fetcher = snoop(() => Promise.resolve([0]));

  createRoot((d) => {
    dispose = d;
    store = create(fetcher.fn)();
  });

  assert.ok(fetcher.called);
  assert.not(store.data);

  await wait(0);
  assert.equal(cloneObject(store.data), [0]);

  store.setData([1]);
  assert.equal(cloneObject(store.data), [1]);

  store.setData((prev) => [...prev, 1]);
  assert.equal(cloneObject(store.data), [1, 1]);

  dispose();
});

test('it should use init value', async () => {
  let dispose!: () => void;
  let store!: Store<string, unknown>;

  createRoot((d) => {
    dispose = d;
    store = create(() => Promise.resolve('bar'))({ initValue: 'foo' });
  });

  assert.is(store.data, 'foo');

  dispose();
});

test('it should handle params', async () => {
  type Params = { id: string };

  let dispose!: () => void;
  let store!: Store<string, Params>;

  const fetcher = snoop((params: Params) => Promise.resolve(params.id));

  createRoot((d) => {
    dispose = d;
    store = create(fetcher.fn)({ params: { id: 'foo' } });
  });

  assert.equal(store.params.id, 'foo');
  await wait(0);
  assert.equal(store.data, 'foo');

  store.setParams({ id: 'bar' });
  assert.equal(store.params.id, 'bar');
  await wait(0);
  assert.equal(store.data, 'bar');

  store.setParams((prev) => ({ id: `#${prev.id}` }));
  assert.equal(store.params.id, '#bar');
  await wait(0);
  assert.equal(store.data, '#bar');
  assert.is(fetcher.callCount, 3);

  dispose();
});

test('it should skip fetching', async () => {
  let dispose!: () => void;
  let store!: Store<boolean, unknown>;

  const fetcher = snoop(() => Promise.resolve(true));

  createRoot((d) => {
    dispose = d;
    store = create(fetcher.fn)({ skip: true });
  });

  assert.ok(fetcher.notCalled);

  await wait(0);
  assert.not(store.data);

  dispose();
});

test('it should handle dependencies', async () => {
  type Params = { test: string };

  let dispose!: () => void;
  let signal!: Signal<string>;
  let store!: Store<string, Params>;

  const fetcher = snoop((params: Params) => Promise.resolve(params.test));

  createRoot((d) => {
    dispose = d;
    signal = createSignal('a');
    store = create(fetcher.fn)({ params: { test: signal[0]() }, deps: () => ({ test: signal[0]() }) });
  });

  assert.equal(store.params.test, 'a');
  await wait(0);
  assert.equal(store.data, 'a');

  signal[1]('b');
  assert.equal(store.params.test, 'b');
  await wait(0);
  assert.is(fetcher.callCount, 2);
  assert.equal(store.data, 'b');

  dispose();
});

test('it should call onSuccess callback', async () => {
  let dispose!: () => void;
  const onSuccess = snoop(getNoop());

  createRoot((d) => {
    dispose = d;
    create(() => Promise.resolve(1))({ onSuccess: onSuccess.fn });
  });

  await wait(0);
  assert.is(onSuccess.callCount, 1);
  assert.equal(onSuccess.lastCall.arguments, [1]);

  dispose();
});

test.run();
