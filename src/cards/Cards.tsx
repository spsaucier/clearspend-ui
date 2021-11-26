import { createSignal } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { useMediaContext } from '_common/api/media/context';
import { Button } from '_common/components/Button';
import { Drawer } from '_common/components/Drawer';
import { Page } from 'app/components/Page';
import type { UUIDString } from 'app/types/common';
import { EmployeePreview } from 'employees/containers/EmployeePreview';

import { CardsData } from './components/CardsData';
import { useCards } from './stores/cards';
import type { SearchCardRequest } from './types';

const DEFAULT_PARAMS: Readonly<SearchCardRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
};

export default function Cards() {
  const navigate = useNavigate();
  const media = useMediaContext();

  const [uid, setUID] = createSignal<UUIDString | null>(null);
  const cardsStore = useCards({ params: DEFAULT_PARAMS });

  const onSearch = (searchText: string) => cardsStore.setParams((prev) => ({ ...prev, searchText }));

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
        onSearch={onSearch}
        onCardClick={(cardId) => navigate(`/cards/view/${cardId}`)}
        onUserClick={setUID}
      />
      <Drawer open={Boolean(uid())} title={<Text message="Employee Profile" />} onClose={() => setUID(null)}>
        <EmployeePreview uid={uid()!} />
      </Drawer>
    </Page>
  );
}
