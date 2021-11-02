import { createResource, For } from 'solid-js';

import { events } from '_common/api/events';
import { Button } from '_common/components/Button';
import { wrapAction } from '_common/utils/wrapAction';
import { Page } from 'app/components/Page';
import { ownerStore } from 'app/stores/owner';
import { AppEvent } from 'app/types/common';

import { getUsers } from './services';
import { formatName } from './utils/formatName';

export default function Employees() {
  const [data] = createResource(getUsers, { initialValue: [] });

  const [loading, logout] = wrapAction(ownerStore.logout);

  return (
    <Page title="Employees">
      <ul>
        <For each={data()}>{(item) => <li>{`(${item.type}) ${formatName(item)}`}</li>}</For>
      </ul>
      <Button
        type="primary"
        loading={loading()}
        onClick={() => {
          logout().then(() => {
            events.emit(AppEvent.Logout);
          });
        }}
      >
        Logout
      </Button>
    </Page>
  );
}
