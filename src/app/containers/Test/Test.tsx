import { createSignal, For } from 'solid-js';

import { keys } from '_common/utils/keys';
import type { UUIDString } from 'app/types/common';
import { Page } from 'app/components/Page';
import { Select, Option } from '_common/components/Select';
import { Button } from '_common/components/Button';
import { RadioGroup, Radio } from '_common/components/Radio';
import { BankAccounts } from 'onboarding/components/BankAccounts';
import { USA_STATES } from 'onboarding/constants/usa';

export default function Test() {
  const [loading, setLoading] = createSignal(false);
  const [state, setState] = createSignal('');

  return (
    <Page title="Test">
      <div style={{ padding: '16px 48px' }}>
        <Select name="state" placeholder="Choose state" value={state()} onChange={setState}>
          <For each={keys(USA_STATES)}>{(item) => <Option value={item}>{USA_STATES[item]!}</Option>}</For>
        </Select>
        <br />
        <br />
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
            {
              businessBankAccountId: '1' as UUIDString,
              accountNumber: '1234567812340000',
              routingNumber: '',
              name: 'Some name',
            },
            {
              businessBankAccountId: '2' as UUIDString,
              accountNumber: '1234567812341111',
              routingNumber: '',
              name: 'Some other name',
            },
          ]}
        />
        <br />
        <br />
        <Select name="state" placeholder="Choose state" value={state()} onChange={setState}>
          <For each={keys(USA_STATES)}>{(item) => <Option value={item}>{USA_STATES[item]!}</Option>}</For>
        </Select>
        <div>{state()}</div>
      </div>
    </Page>
  );
}
