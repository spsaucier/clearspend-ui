import { Show, Switch, Match } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import { useNavigate } from 'solid-app-router';

import { events } from '_common/api/events';
import { useMediaContext } from '_common/api/media/context';
import { Button } from '_common/components/Button';
// import { Drawer } from '_common/components/Drawer';
import { wrapAction } from '_common/utils/wrapAction';
import { Page } from 'app/components/Page';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { logout } from 'app/services/auth';
import { UUIDString, AppEvent } from 'app/types/common';

import { EmployeesList } from './components/EmployeesList';
import { EmployeesTable } from './components/EmployeesTable';
// import { EmployeeProfile } from './containers/EmployeeProfile';
import { useUsers } from './stores/employees';
import type { SearchUserRequest } from './types';

const DEFAULT_ACTIVITY_PARAMS: Readonly<SearchUserRequest> = {
  pageRequest: {
    pageNumber: 0,
    pageSize: 10,
  },
};

export default function Employees() {
  const navigate = useNavigate();
  const media = useMediaContext();

  // const [uid, setUID] = createSignal<UUIDString | null>(null);

  const usersStore = useUsers({ params: DEFAULT_ACTIVITY_PARAMS });
  const [loading, logoutAction] = wrapAction(() => logout().then(() => events.emit(AppEvent.Logout)));

  return (
    <Page
      title="Employees"
      actions={
        <Button type="primary" size="lg" icon="add" onClick={() => navigate('/employees/edit')}>
          New employee
        </Button>
      }
    >
      <Switch>
        <Match when={usersStore.error}>
          <LoadingError onReload={usersStore.reload} />
        </Match>
        <Match when={usersStore.loading && !usersStore.data}>
          <Loading />
        </Match>
        <Match when={usersStore.data}>
          {(data) => (
            <Dynamic
              component={media.large ? EmployeesTable : EmployeesList}
              data={data}
              onClick={(id: UUIDString) => navigate(`/employees/view/${id}`)}
              onChangeParams={usersStore.setParams}
            />
          )}
        </Match>
      </Switch>
      <Show when={process.env.NODE_ENV === 'development'}>
        <div style={{ 'margin-top': '24px' }}>
          <Button type="primary" loading={loading()} onClick={logoutAction}>
            Logout
          </Button>
        </div>
      </Show>
      {/*
      <Drawer open={Boolean(uid())} title="Employee Profile" onClose={() => setUID(null)}>
        <EmployeeProfile uid={uid()!} />
      </Drawer>
      */}
    </Page>
  );
}
