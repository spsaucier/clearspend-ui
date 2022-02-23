import { createSignal } from 'solid-js';
import { Text } from 'solid-i18n';

import { useResource } from '_common/utils/useResource';
import { useMediaContext } from '_common/api/media/context';
import { Drawer } from '_common/components/Drawer';
import { CardsData } from 'cards/components/CardsData';
import { CardPreview } from 'cards/containers/CardPreview';
import { searchCards } from 'cards/services';
import type { User } from 'generated/capital';
import { DEFAULT_CARD_PARAMS } from 'cards/Cards';

interface CardsProps {
  userId: User['userId'];
}

export function Cards(props: Readonly<CardsProps>) {
  const media = useMediaContext();

  const [cardID, setCardID] = createSignal<string | null>(null);
  const [cards, status, params, setParams, reload] = useResource(searchCards, {
    ...DEFAULT_CARD_PARAMS,
    userId: props.userId,
  });

  return (
    <>
      <CardsData
        table={media.large}
        loading={status().loading}
        error={status().error}
        data={cards() as {}}
        omitFilters={['userId']}
        onReload={reload}
        onCardClick={setCardID}
        onChangeParams={setParams}
        params={params()}
      />
      <Drawer open={Boolean(cardID())} title={<Text message="Card summary" />} onClose={() => setCardID(null)}>
        <CardPreview cardID={cardID()!} />
      </Drawer>
    </>
  );
}
