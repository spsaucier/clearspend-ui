import { createSignal, Show, Switch, Match } from 'solid-js';
import { useNavigate } from 'solid-app-router';

import { events } from '_common/api/events';
import { useResource } from '_common/utils/useResource';
import { Button } from '_common/components/Button';
import { Drawer } from '_common/components/Drawer';
import { wrapAction } from '_common/utils/wrapAction';
import { Page } from 'app/components/Page';
import { LoadingError } from 'app/components/LoadingError';
import { Loading } from 'app/components/Loading';
import { logout } from 'app/services/auth';
import { UUIDString, AppEvent } from 'app/types/common';

import { EmployeesTable } from './components/EmployeesTable';
import { EmployeeProfile } from './containers/EmployeeProfile';
import { getUsers } from './services';

export default function Employees() {
  const navigate = useNavigate();

  const [uid, setUID] = createSignal<UUIDString | null>(null);

  const [users, status, , , reload] = useResource(getUsers, null);
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
        <Match when={status().error}>
          <LoadingError onReload={reload} />
        </Match>
        <Match when={status().loading && !users()}>
          <Loading />
        </Match>
        <Match when={users()}>{(items) => <EmployeesTable items={items} onClick={setUID} />}</Match>
      </Switch>
      <Show when={process.env.NODE_ENV === 'development'}>
        <div style={{ 'margin-top': '24px' }}>
          <Button type="primary" loading={loading()} onClick={logoutAction}>
            Logout
          </Button>
        </div>
      </Show>
      <Drawer open={Boolean(uid())} title="Employee Profile" onClose={() => setUID(null)}>
        <EmployeeProfile uid={uid()!} />
      </Drawer>
    </Page>
  );
}
