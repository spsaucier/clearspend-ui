import { createSignal } from 'solid-js';

import { Page } from 'app/components/Page';
import { Button } from '_common/components/Button';
import { RadioGroup, Radio } from '_common/components/Radio';
import { BankAccounts } from 'onboarding/components/BankAccounts';

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
        <br />
        <br />
        <RadioGroup name="test">
          <Radio value="1" />
          <Radio value="2">Something</Radio>
          <Radio value="3" disabled>
            Disabled
          </Radio>
        </RadioGroup>
        <br />
        <br />
        <BankAccounts
          accounts={[
            { id: '1', mask: '0000', name: 'Some name', subtype: 'type', type: 'type' },
            { id: '2', mask: '1111', name: 'Some other name', subtype: 'type', type: 'type' },
          ]}
        />
      </div>
    </Page>
  );
}
