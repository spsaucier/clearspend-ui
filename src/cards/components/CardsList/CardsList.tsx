import { For, Show } from 'solid-js';
import { useI18n, Text } from 'solid-i18n';

import type { Setter } from '_common/types/common';
import { formatCurrency } from '_common/api/intl/formatCurrency';
import { InputSearch } from '_common/components/InputSearch';
import { changeRequestSearch } from 'app/utils/changeRequestSearch';
import { Empty } from 'app/components/Empty';
import type { PagedDataSearchCardData, SearchCardRequest } from 'generated/capital';
import type { CardType as CardTypeType } from 'cards/types';
import { formatCardNumber } from 'cards/utils/formatCardNumber';

import { CardIcon } from '../CardIcon';
import { CardType } from '../CardType';

import css from './CardsList.css';

interface CardsListProps {
  search?: string;
  data: PagedDataSearchCardData;
  onCardClick: (id: string) => void;
  onChangeParams: Setter<Readonly<SearchCardRequest>>;
}

export function CardsList(props: Readonly<CardsListProps>) {
  const i18n = useI18n();

  return (
    <div>
      <InputSearch
        delay={400}
        value={props.search}
        placeholder={String(i18n.t('Search cards...'))}
        class={css.search}
        onSearch={changeRequestSearch(props.onChangeParams)}
      />
      <Show when={props.data.content?.length} fallback={<Empty message={<Text message="There are no cards" />} />}>
        <For each={props.data.content}>
          {(item) => (
            <div class={css.item} onClick={() => props.onCardClick(item.cardId!)}>
              <CardIcon status={item.cardStatus} type={item.cardType as CardTypeType} />
              <div>
                <div class={css.name}>{formatCardNumber(item.cardNumber, item.activated)}</div>
                <CardType type={item.cardType as CardTypeType} class={css.sub} />
              </div>
              <div>
                <strong>{formatCurrency(item.balance?.amount || 0)}</strong>
                {/* TODO: <div class={css.sub}>[Limit]</div> */}
              </div>
            </div>
          )}
        </For>
      </Show>
    </div>
  );
}
