import { createMemo, Show, For, Index } from 'solid-js';
import { Text } from 'solid-i18n';

import { times } from '../../utils/times';
import { join } from '../../utils/join';
import { Button } from '../Button';
import { Select, Option } from '../Select';

import css from './Pagination.css';

const MAX_BUTTONS = 5;
const SLICE_COUNT = 2;

// eslint-disable-next-line @typescript-eslint/no-magic-numbers
const PER_PAGE = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = PER_PAGE[0]!;

export interface PaginationProps {
  current: number;
  pageSize: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
}

export function Pagination(props: Readonly<PaginationProps>) {
  const pages = createMemo(() => times(Math.ceil(props.total / props.pageSize)).map((_, index) => index));

  const buttons = createMemo(() => {
    const items = pages();
    const index = items.findIndex((item) => item === props.current);

    if (items.length <= MAX_BUTTONS) return items;

    if (index < SLICE_COUNT || index > items.length - 1 - SLICE_COUNT) {
      return [...items.slice(0, SLICE_COUNT), undefined, ...items.slice(-SLICE_COUNT)];
    }

    return [undefined, ...items.slice(index - (SLICE_COUNT - 1), index + SLICE_COUNT), undefined];
  });

  return (
    <div class={css.root}>
      <ul class={css.pagination}>
        <li>
          <Button
            icon="chevron-left"
            disabled={props.current === 0}
            class={join(css.button, css.nav)}
            onClick={() => props.onChange(props.current - 1, props.pageSize)}
            data-name="Previous page"
          />
        </li>
        <For each={buttons()}>
          {(item) => (
            <li>
              <Button
                disabled={item === undefined}
                class={join(css.button, item === props.current && css.active)}
                onClick={() => item !== undefined && props.onChange(item, props.pageSize)}
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
            onClick={() => props.onChange(props.current + 1, props.pageSize)}
            data-name="Next page"
          />
        </li>
      </ul>
      <Show when={props.total > DEFAULT_PAGE_SIZE}>
        <Select
          class={css.size}
          value={String(props.pageSize)}
          onChange={(val) => props.onChange(0, parseInt(val, 10))}
        >
          <Index each={PER_PAGE}>
            {(val) => (
              <Option value={String(val())}>
                <Text message="{count} / page" count={val()} />
              </Option>
            )}
          </Index>
        </Select>
      </Show>
    </div>
  );
}
