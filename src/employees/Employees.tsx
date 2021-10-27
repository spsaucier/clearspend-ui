import { createResource, For } from 'solid-js';

import { Page } from 'app/components/Page';

import { getUsers } from './services';

export default function Employees() {
  const [data] = createResource(getUsers, { initialValue: [] });

  return (
    <Page title="Employees">
      <ul>
        <For each={data()}>{(item) => <li>{`(${item.type}) ${item.firstName} ${item.lastName}`}</li>}</For>
      </ul>
    </Page>
  );
}
