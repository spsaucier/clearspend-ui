import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { createSignal } from 'solid-js';
import { render, fireEvent } from 'solid-testing-library';

import { queryByDataName } from '../../utils/testing';

import { InputPhone } from './InputPhone';

const test = suite('InputPhone');

test('it renders formatted value', () => {
  const { container, unmount } = render(() => {
    const [value, setValue] = createSignal('');
    return <InputPhone name="phone" value={value()} onChange={setValue} />;
  });

  const input = queryByDataName(container, 'phone') as HTMLInputElement;

  fireEvent.click(input);
  fireEvent.input(input, { target: { value: '1111111111' } });

  assert.equal(input.value, '(111) 111-1111');
  unmount();
});

test.run();
