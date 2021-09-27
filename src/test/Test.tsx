import { createResource, Show } from 'solid-js';

import { TestForm } from 'test/components/TestForm/TestForm';
import type { TestData } from 'test/types';

function getWrapper() {
  let data: TestData = { name: 'Test', active: true, colors: [] };
  return {
    fetcher: async () =>
      new Promise<TestData>((resolve) => {
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        setTimeout(() => resolve(data), 2000);
      }),
    setData: (value: TestData) => {
      data = value;
    },
  };
}

export function Test() {
  const wrap = getWrapper();
  const [data, { refetch }] = createResource<TestData>(wrap.fetcher);

  const submit = (value: TestData) => {
    wrap.setData(value);
    refetch();
  };

  return (
    <div>
      <Show when={!!data()} fallback={<div>Loading...</div>}>
        <TestForm data={data()!} loading={data.loading} onSubmit={submit} />
      </Show>
    </div>
  );
}
