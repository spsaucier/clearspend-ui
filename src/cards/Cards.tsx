import { createSignal, Show } from 'solid-js';
import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { storage } from '_common/api/storage';
import { useMediaContext } from '_common/api/media/context';
import { DEFAULT_PAGE_SIZE } from '_common/components/Pagination';
import { Button } from '_common/components/Button';
import { Drawer } from '_common/components/Drawer';
import { Page } from 'app/components/Page';
import { useBusiness } from 'app/containers/Main/context';
import { extendPageSize, onPageSizeChange } from 'app/utils/pageSizeParam';
import { EmployeePreview } from 'employees/containers/EmployeePreview';
import { canManageCards, hasSomeManagerRole } from 'allocations/utils/permissions';

import { CardsData } from './components/CardsData';
import { CARDS_PAGE_SIZE_STORAGE_KEY, DEFAULT_CARD_PARAMS } from './constants';
import { useCards } from './stores/cards';

export default function Cards() {
  const navigate = useNavigate();
  const media = useMediaContext();
  const { permissions, currentUserRoles } = useBusiness();

  const [uid, setUID] = createSignal<string | null>(null);
  const cardsStore = useCards({
    params: extendPageSize(DEFAULT_CARD_PARAMS, storage.get(CARDS_PAGE_SIZE_STORAGE_KEY, DEFAULT_PAGE_SIZE)),
  });

  return (
    <Page
      title={<Text message="Cards" />}
      actions={
        <Show when={canManageCards(permissions()) || hasSomeManagerRole(currentUserRoles())}>
          <Button type="primary" size="lg" icon="add" onClick={() => navigate('/cards/edit')} data-name="Add New Card">
            <Text message="New Card" />
          </Button>
        </Show>
      }
    >
      <CardsData
        table={media.large}
        loading={cardsStore.loading}
        error={cardsStore.error}
        data={cardsStore.data}
        onReload={cardsStore.reload}
        params={cardsStore.params}
        onCardClick={(id) => navigate(`/cards/view/${id}`)}
        onUserClick={setUID}
        onChangeParams={onPageSizeChange(cardsStore.setParams, (size) =>
          storage.set(CARDS_PAGE_SIZE_STORAGE_KEY, size),
        )}
      />
      <Drawer
        open={Boolean(uid())}
        title={<Text message="Employee Profile" />}
        onClose={() => setUID(null)}
        noPadding={true}
      >
        <EmployeePreview uid={uid()!} />
      </Drawer>
    </Page>
  );
}
