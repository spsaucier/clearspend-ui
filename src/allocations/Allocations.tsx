import { createResource, For } from 'solid-js';

import { Page } from 'app/components/Page';

import { getAllocations } from './services';

export default function Allocations() {
  const [data] = createResource(getAllocations, { initialValue: [] });

  return (
    <Page title="Allocations">
      <ul>
        <For each={data()}>{(item) => <li>{item.name}</li>}</For>
      </ul>
    </Page>
  );
}
