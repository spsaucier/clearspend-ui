import { createSignal, Show } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { useMediaContext } from '_common/api/media/context';
import { Drawer } from '_common/components/Drawer';
import { Button } from '_common/components/Button';
import { Page } from 'app/components/Page';
import { Data } from 'app/components/Data';
import { CardPreview } from 'cards/containers/CardPreview';
import type { SearchUserRequest } from 'generated/capital';
import { canManageCards } from 'allocations/utils/permissions';

import { useBusiness } from '../app/containers/Main/context';

import { EmployeesList } from './components/EmployeesList';
import { EmployeesTable } from './components/EmployeesTable';
import { useUsers } from './stores/employees';

export const DEFAULT_EMPLOYEE_PARAMS: Readonly<SearchUserRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
    orderBy: [
      {
        item: 'lastName',
        direction: 'ASC',
      },
      {
        item: 'firstName',
        direction: 'ASC',
      },
    ],
  },
};

export default function Employees() {
  const navigate = useNavigate();
  const media = useMediaContext();
  const { permissions } = useBusiness();

  const [cardID, setCardID] = createSignal<string | null>(null);

  const usersStore = useUsers({ params: DEFAULT_EMPLOYEE_PARAMS });

  return (
    <Page
      title={<Text message="Employees" />}
      actions={
        <Show when={canManageCards(permissions())}>
          <Button type="primary" size="lg" icon="add" onClick={() => navigate('/employees/add')}>
            <Text message="New employee" />
          </Button>
        </Show>
      }
    >
      <Data data={usersStore.data} loading={usersStore.loading} error={usersStore.error} onReload={usersStore.reload}>
        <Dynamic
          component={media.large ? EmployeesTable : EmployeesList}
          data={usersStore.data!}
          params={usersStore.params}
          onClick={(id: string) => navigate(`/employees/view/${id}`)}
          onCardClick={setCardID}
          onChangeParams={usersStore.setParams}
        />
      </Data>
      <Drawer open={Boolean(cardID())} title={<Text message="Card summary" />} onClose={() => setCardID(null)}>
        <CardPreview cardID={cardID()!} />
      </Drawer>
    </Page>
  );
}
