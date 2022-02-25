import { createMemo, For } from 'solid-js';

import { times } from '../../utils/times';
import { join } from '../../utils/join';
import { Button } from '../Button';

import css from './Pagination.css';

const MAX_PAGES = 5;
const SLICE_COUNT = 2;

export interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number) => void;
}

export function Pagination(props: Readonly<PaginationProps>) {
  const pages = createMemo(() => times(Math.ceil(props.total / props.pageSize)).map((_, index) => index));

  const buttons = createMemo(() => {
    const items = pages();
    const index = items.findIndex((item) => item === props.current);

    if (items.length <= MAX_PAGES) return items;

    if (index < SLICE_COUNT || index > items.length - 1 - SLICE_COUNT) {
      return [...items.slice(0, SLICE_COUNT), undefined, ...items.slice(-SLICE_COUNT)];
    }

    return [undefined, ...items.slice(index - (SLICE_COUNT - 1), index + SLICE_COUNT), undefined];
  });

  return (
    <ul class={css.root}>
      <li>
        <Button
          icon="chevron-left"
          disabled={props.current === 0}
          class={join(css.button, css.nav)}
          onClick={() => props.onChange(props.current - 1)}
          data-name="Previous page"
        />
      </li>
      <For each={buttons()}>
        {(item) => (
          <li>
            <Button
              disabled={item === undefined}
              class={join(css.button, item === props.current && css.active)}
              onClick={() => item !== undefined && props.onChange(item)}
              data-name={`Page ${(item || 0) + 1}`}
            >
              {typeof item === 'number' ? item + 1 : '...'}
            </Button>
          </li>
        )}
      </For>
      <li>
        <Button
          icon="chevron-right"
          disabled={!pages().length || props.current === pages().length - 1}
          class={join(css.button, css.nav)}
          onClick={() => props.onChange(props.current + 1)}
          data-name="Next page"
        />
      </li>
    </ul>
  );
}
