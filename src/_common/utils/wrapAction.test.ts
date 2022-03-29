import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { wrapAction } from './wrapAction';

test('wrapAction utility', async () => {
  const action = () => Promise.resolve();

  const [loading, handler] = wrapAction(action);

  assert.type(loading, 'function');
  assert.type(handler, 'function');

  assert.is(loading(), false);
  const promise = handler();
  assert.is(loading(), true);

  await promise;
  assert.is(loading(), false);
});

test.run();
