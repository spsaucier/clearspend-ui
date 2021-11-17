import { Dynamic } from 'solid-js/web';
import { Text } from 'solid-i18n';

import { useMediaContext } from '_common/api/media/context';
import { CardsList } from 'cards/components/CardsList';
import { CardsTable } from 'cards/components/CardsTable';
import CARDS from 'cards/cards.json';
import type { SearchCardResponse } from 'cards/types';

import { AllocationBalances } from '../../components/AllocationBalances';

import css from './Cards.css';

const DATA = {
  number: 0,
  size: 10,
  totalElements: 6,
  content: [...CARDS, ...CARDS, ...CARDS] as unknown as SearchCardResponse['content'],
} as SearchCardResponse;

export function Cards() {
  const media = useMediaContext();

  return (
    <>
      <AllocationBalances />
      <h3 class={css.title}>
        <Text message="Cards" />
      </h3>
      <Dynamic component={media.wide ? CardsTable : CardsList} data={DATA} hideColumns={['allocation']} />
    </>
  );
}
