import { createSignal } from 'solid-js';
import { Text } from 'solid-i18n';

import { useBool } from '_common/utils/useBool';
import { useResource } from '_common/utils/useResource';
import { useMediaContext } from '_common/api/media/context';
import { Drawer } from '_common/components/Drawer';
import { CardsData } from 'cards/components/CardsData';
import { CardPreview } from 'cards/containers/CardPreview';
import { CardsFilters } from 'cards/containers/CardsFilters';
import { searchCards } from 'cards/services';
import type { SearchCardRequest, User } from 'generated/capital';

const DEFAULT_PARAMS: Readonly<SearchCardRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
};

interface CardsProps {
  userId: User['userId'];
}

export function Cards(props: Readonly<CardsProps>) {
  const media = useMediaContext();

  const [showFilters, toggleFilters] = useBool();
  const [cardID, setCardID] = createSignal<string | null>(null);
  const [cards, status, , setParams, reload] = useResource(searchCards, { ...DEFAULT_PARAMS, userId: props.userId });

  return (
    <>
      <CardsData
        table={media.large}
        loading={status().loading}
        error={status().error}
        data={cards() as {}}
        hide={['name']}
        onReload={reload}
        onCardClick={setCardID}
        onFiltersClick={toggleFilters}
        onChangeParams={setParams}
      />
      <Drawer noPadding open={showFilters()} title={<Text message="Filter cards" />} onClose={toggleFilters}>
        <CardsFilters exclude="users" onClose={toggleFilters} />
      </Drawer>
      <Drawer open={Boolean(cardID())} title={<Text message="Card summary" />} onClose={() => setCardID(null)}>
        <CardPreview cardID={cardID()!} />
      </Drawer>
    </>
  );
}
