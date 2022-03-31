import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { createRoot, createSignal } from 'solid-js';

import { useDeferEffect } from './useDeferEffect';
import { wait } from './wait';

const test = suite('useDeferEffect');

type Result = (string | undefined)[][];

test('it runs defer function with correct arguments', async () => {
  const expects: Result = [
    ['foo', undefined],
    ['bar', 'foo'],
    ['baz', 'bar'],
  ];

  const actual = await new Promise<Result>((resolve) => {
    createRoot(async (dispose) => {
      const updates = ['foo', 'bar', 'baz'];
      const result: Result = [];

      const [dependency, trigger] = createSignal<string>('');

      useDeferEffect((...args) => {
        result.push(args);

        if (!updates.length) {
          dispose();
          resolve(result);
        }

        trigger(updates.shift()!);
      }, dependency);

      await wait(1);
      trigger(updates.shift()!);
    });
  });

  assert.equal(actual, expects);
});

test.run();
