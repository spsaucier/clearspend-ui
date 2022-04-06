import { suite } from 'uvu';
import { createRoot, createSignal } from 'solid-js';
import * as assert from 'uvu/assert';

import { useDisableBodyScroll } from './useDisableBodyScroll';
import { wait } from './wait';

const test = suite('useDisableBodyScroll');

const EXPECTED_ACTIVE_STYLES_COUNT = 2;

test("it updates body's styles (with correct count of declarations)", async () => {
  const actual = await new Promise<number>((resolve) => {
    createRoot(async (dispose) => {
      const [open, toggle] = createSignal(false);
      useDisableBodyScroll(open);

      await wait(1);
      toggle(true);

      await wait(1);
      resolve(document.body.style.length);
      dispose();
    });
  });

  assert.is(actual, EXPECTED_ACTIVE_STYLES_COUNT);
  assert.is(document.body.style.length, 0);
});

test('it does not clear styles as long as there is at least one open state', async () => {
  const actual = await new Promise<number>((resolve) => {
    createRoot(async (dispose) => {
      const [open1, toggle1] = createSignal(false);
      const [open2, toggle2] = createSignal(false);

      useDisableBodyScroll(open1);
      useDisableBodyScroll(open2);

      await wait(1);
      toggle1(true);
      toggle2(true);

      await wait(1);
      toggle2(false);

      await wait(1);
      resolve(document.body.style.length);
      dispose();
    });
  });

  assert.is(actual, EXPECTED_ACTIVE_STYLES_COUNT);
});

test.run();
