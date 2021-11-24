import { For } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { formatCurrency } from '_common/api/intl/formatCurrency';
import { Input } from '_common/components/Input';
import { Icon } from '_common/components/Icon';
import { formatName } from 'employees/utils/formatName';

import { formatCardNumber } from '../../utils/formatCardNumber';
import type { SearchCardResponse } from '../../types';

import css from './CardsList.css';

interface CardsListProps {
  data: SearchCardResponse;
}

export function CardsList(props: Readonly<CardsListProps>) {
  const navigate = useNavigate();

  return (
    <div>
      <Input disabled placeholder="Search cards..." suffix={<Icon name="search" size="sm" />} class={css.search} />
      <For each={props.data.content}>
        {(item) => (
          <div class={css.item} onClick={() => navigate(`/cards/view/${item.cardId}`)}>
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
