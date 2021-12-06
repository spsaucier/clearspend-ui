import { createSignal } from 'solid-js';
import { Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { useMediaContext } from '_common/api/media/context';
import { Drawer } from '_common/components/Drawer';
import { CardsData } from 'cards/components/CardsData';
import { CardPreview } from 'cards/containers/CardPreview';
import { searchCards } from 'cards/services';
import type { SearchCardRequest } from 'cards/types';
import type { UUIDString } from 'app/types/common';

import type { User } from '../../types';

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

  const [cardID, setCardID] = createSignal<UUIDString | null>(null);
  const [cards, status, , setParams, reload] = useResource(searchCards, { ...DEFAULT_PARAMS, userId: props.userId });

  return (
    <>
      <CardsData
        table={media.large}
        loading={status().loading}
        error={status().error}
        data={cards()}
        hide={['name']}
        onReload={reload}
        onCardClick={setCardID}
        onChangeParams={setParams}
      />
      <Drawer open={Boolean(cardID())} title={<Text message="Card summary" />} onClose={() => setCardID(null)}>
        <CardPreview cardID={cardID()!} />
      </Drawer>
    </>
  );
}