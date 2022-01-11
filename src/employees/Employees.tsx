import { createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useNavigate } from 'solid-app-router';
import { Text } from 'solid-i18n';

import { events } from '_common/api/events';
import { useMediaContext } from '_common/api/media/context';
import { Drawer } from '_common/components/Drawer';
import { Button } from '_common/components/Button';
import { wrapAction } from '_common/utils/wrapAction';
import { Page } from 'app/components/Page';
import { Data } from 'app/components/Data';
import { logout } from 'app/services/auth';
import { AppEvent } from 'app/types/common';
import { CardPreview } from 'cards/containers/CardPreview';
import type { SearchUserRequest } from 'generated/capital';

import { EmployeesList } from './components/EmployeesList';
import { EmployeesTable } from './components/EmployeesTable';
import { useUsers } from './stores/employees';

export const DEFAULT_ACTIVITY_PARAMS: Readonly<SearchUserRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
};

export default function Employees() {
  const navigate = useNavigate();
  const media = useMediaContext();

  const [cardID, setCardID] = createSignal<string | null>(null);

  const usersStore = useUsers({ params: DEFAULT_ACTIVITY_PARAMS });
  const [loading, logoutAction] = wrapAction(() => logout().then(() => events.emit(AppEvent.Logout)));

  return (
    <Page
      title={<Text message="Employees" />}
      actions={
        <Button type="primary" size="lg" icon="add" onClick={() => navigate('/employees/edit')}>
          <Text message="New employee" />
        </Button>
      }
    >
      <Data data={usersStore.data} loading={usersStore.loading} error={usersStore.error} onReload={usersStore.reload}>
        <Dynamic
          component={media.large ? EmployeesTable : EmployeesList}
          data={usersStore.data!}
          onClick={(id: string) => navigate(`/employees/view/${id}`)}
          onCardClick={setCardID}
          onChangeParams={usersStore.setParams}
        />
      </Data>
      <Drawer open={Boolean(cardID())} title={<Text message="Card summary" />} onClose={() => setCardID(null)}>
        <CardPreview cardID={cardID()!} />
      </Drawer>
      <div style={{ 'margin-top': '24px' }}>
        <Button type="primary" loading={loading()} onClick={logoutAction}>
          Logout
        </Button>
      </div>
    </Page>
  );
}
