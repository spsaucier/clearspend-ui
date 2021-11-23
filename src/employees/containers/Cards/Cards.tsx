import { Show, Dynamic } from 'solid-js/web';

import { useMediaContext } from '_common/api/media/context';
import { CardsList } from 'cards/components/CardsList';
import { CardsTable } from 'cards/components/CardsTable';
import CARDS from 'cards/cards.json';
import type { SearchCardResponse } from 'cards/types';

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
      <Show when={DATA.content.length}>
        <Dynamic component={media.wide ? CardsTable : CardsList} data={DATA} hideColumns={['name']} />
      </Show>
    </>
  );
}
