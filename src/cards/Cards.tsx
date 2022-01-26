import { createSignal } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { useMediaContext } from '_common/api/media/context';
import { Button } from '_common/components/Button';
import { Drawer } from '_common/components/Drawer';
import { Page } from 'app/components/Page';
import { EmployeePreview } from 'employees/containers/EmployeePreview';
import type { SearchCardRequest } from 'generated/capital';

import { CardsData } from './components/CardsData';
import { useCards } from './stores/cards';

export const DEFAULT_CARD_PARAMS: Readonly<SearchCardRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
};

export default function Cards() {
  const navigate = useNavigate();
  const media = useMediaContext();

  const [uid, setUID] = createSignal<string | null>(null);
  const cardsStore = useCards({ params: DEFAULT_CARD_PARAMS });

  return (
    <Page
      title={<Text message="Cards" />}
      actions={
        <Button type="primary" size="lg" icon="add" onClick={() => navigate('/cards/edit')}>
          <Text message="New Card" />
        </Button>
      }
    >
      <CardsData
        table={media.large}
        loading={cardsStore.loading}
        error={cardsStore.error}
        data={cardsStore.data}
        onReload={cardsStore.reload}
        params={cardsStore.params}
        onCardClick={(cardId) => navigate(`/cards/view/${cardId}`)}
        onUserClick={setUID}
        onChangeParams={cardsStore.setParams}
      />
      <Drawer open={Boolean(uid())} title={<Text message="Employee Profile" />} onClose={() => setUID(null)}>
        <EmployeePreview uid={uid()!} />
      </Drawer>
    </Page>
  );
}
