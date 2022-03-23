import { createSignal } from 'solid-js';
import { Text } from 'solid-i18n';

import { storage } from '_common/api/storage';
import { useResource } from '_common/utils/useResource';
import { useMediaContext } from '_common/api/media/context';
import { DEFAULT_PAGE_SIZE } from '_common/components/Pagination';
import { Drawer } from '_common/components/Drawer';
import { extendPageSize, onPageSizeChange } from 'app/utils/pageSizeParam';
import { CardsData } from 'cards/components/CardsData';
import { CardPreview } from 'cards/containers/CardPreview';
import { CARDS_PAGE_SIZE_STORAGE_KEY, DEFAULT_CARD_PARAMS } from 'cards/constants';
import { searchCards } from 'cards/services';
import type { User, SearchCardRequest } from 'generated/capital';

interface CardsProps {
  userId: User['userId'];
}

export function Cards(props: Readonly<CardsProps>) {
  const media = useMediaContext();

  const [cardID, setCardID] = createSignal<string | null>(null);
  const [cards, status, params, setParams, reload] = useResource(searchCards, {
    ...extendPageSize(DEFAULT_CARD_PARAMS, storage.get(CARDS_PAGE_SIZE_STORAGE_KEY, DEFAULT_PAGE_SIZE)),
    userId: props.userId,
  } as SearchCardRequest);

  return (
    <>
      <CardsData
        table={media.large}
        loading={status().loading}
        error={status().error}
        data={cards() as {}}
        omitFilters={['users']}
        onReload={reload}
        onCardClick={setCardID}
        onChangeParams={onPageSizeChange(setParams, (size) => storage.set(CARDS_PAGE_SIZE_STORAGE_KEY, size))}
        params={params()}
      />
      <Drawer open={Boolean(cardID())} title={<Text message="Card summary" />} onClose={() => setCardID(null)}>
        <CardPreview cardID={cardID()!} />
      </Drawer>
    </>
  );
}
