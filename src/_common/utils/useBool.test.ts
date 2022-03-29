import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { useBool } from './useBool';

test('useBool hook', () => {
  const [state, toggle] = useBool();
  assert.is(state(), false);

  toggle();
  assert.is(state(), true);

  toggle();
  assert.is(state(), false);
});

test.run();
