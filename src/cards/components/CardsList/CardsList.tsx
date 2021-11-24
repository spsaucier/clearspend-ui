import { For } from 'solid-js';

import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';

import { formatCardNumber } from '../../utils/formatCardNumber';
import type { SearchCardResponse } from '../../types';

import css from './CardsList.css';

interface CardsListProps {
  data: SearchCardResponse;
}

export function CardsList(props: Readonly<CardsListProps>) {
  return (
    <div>
      <Input disabled placeholder="Search cards..." suffix={<Icon name="search" size="sm" />} class={css.search} />
      <For each={props.data.content}>
        {(item) => (
          <div class={css.item}>
            <div class={css.header}>
              <div class={css.name}>[User Name]</div>
              <strong>[Money]</strong>
            </div>
            <div class={css.footer}>
              <div>{formatCardNumber(item.lastFour)}</div>
              <div>[Limit]</div>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
