import { For } from 'solid-js';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';
import { formatName } from 'employees/utils/formatName';
import type { UUIDString } from 'app/types/common';

import { formatCardNumber } from '../../utils/formatCardNumber';
import type { SearchCardResponse } from '../../types';

import css from './CardsList.css';

interface CardsListProps {
  data: SearchCardResponse;
  onCardClick: (id: UUIDString) => void;
}

export function CardsList(props: Readonly<CardsListProps>) {
  return (
    <div>
      <Input disabled placeholder="Search cards..." suffix={<Icon name="search" size="sm" />} class={css.search} />
      <For each={props.data.content}>
        {(item) => (
          <div class={css.item} onClick={() => props.onCardClick(item.cardId)}>
            <div class={css.header}>
              <div class={css.name}>{formatName(item.user)}</div>
              <strong>{formatCurrency(item.balance.amount)}</strong>
            </div>
            <div class={css.footer}>
              <div>{formatCardNumber(item.cardNumber)}</div>
              <div>[Limit]</div>
            </div>
          </div>
        )}
      </For>
    </div>
  );
}
