import { createResource, For } from 'solid-js';

import { events } from '_common/api/events';
import { Button } from '_common/components/Button';
import { wrapAction } from '_common/utils/wrapAction';
import { Page } from 'app/components/Page';
import { logout } from 'app/services/auth';
import { AppEvent } from 'app/types/common';

import { getUsers } from './services';
import { formatName } from './utils/formatName';

export default function Employees() {
  const [data] = createResource(getUsers, { initialValue: [] });
  const [loading, logoutAction] = wrapAction(() => logout().then(() => events.emit(AppEvent.Logout)));

  return (
    <Page title="Employees">
      <ul>
        <For each={data()}>{(item) => <li>{`(${item.type}) ${formatName(item)}`}</li>}</For>
      </ul>
      <Button type="primary" loading={loading()} onClick={logoutAction}>
        Logout
      </Button>
    </Page>
  );
}
