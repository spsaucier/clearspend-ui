import { test } from 'uvu';
import * as assert from 'uvu/assert';

import { join } from './join';

test('join classes utility', () => {
  assert.equal(join(''), '');
  assert.equal(join(false), '');
  assert.equal(join(undefined), '');
  assert.equal(join('foo', 'baz'), 'foo baz');
  assert.equal(join('foo', 'baz', undefined, 'bar'), 'foo baz bar');
});

test.run();
