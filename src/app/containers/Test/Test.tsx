import { createSignal } from 'solid-js';

import { Page } from 'app/components/Page';
import { Button } from '_common/components/Button';

import { AllocationSelect } from '../../components/AllocationSelect';

export function Test() {
  const [loading, setLoading] = createSignal(false);
  const [allocation, setAllocation] = createSignal('1');

  return (
    <Page title="Test" extra={<AllocationSelect value={allocation()} onChange={setAllocation} />}>
      <div style={{ padding: '16px 48px' }}>
        <Button
          type="primary"
          loading={loading()}
          onClick={() => {
            setLoading(true);
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            setTimeout(() => setLoading(false), 10000);
          }}
        >
          Verify Now
        </Button>
      </div>
    </Page>
  );
}
