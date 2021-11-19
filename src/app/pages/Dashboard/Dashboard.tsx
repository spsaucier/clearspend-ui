import { createSignal, createEffect } from 'solid-js';
import { Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { Button } from '_common/components/Button';
import { Dropdown, MenuItem } from '_common/components/Dropdown';
// import { Tag } from '_common/components/Tag';
import { AllocationSelect } from 'allocations/components/AllocationSelect';
import { useAllocations } from 'allocations/stores/allocations';
import { getRootAllocation } from 'allocations/utils/getRootAllocation';

import { Page } from '../../components/Page';
// import { Landing } from '../../containers/Landing';
import { Overview } from '../../containers/Overview';
import { useBusiness } from '../../containers/Main/context';

import css from './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const { owner } = useBusiness();

  const [allocation, setAllocation] = createSignal<string>('');
  const allocations = useAllocations({ initValue: [] });

  createEffect(() => {
    const root = getRootAllocation(allocations.data);
    if (root) setAllocation(root.allocationId);
  });

  return (
    <Page
      title={<Text message="Welcome, {name}" name={owner().firstName} />}
      contentClass={css.content}
      extra={
        <AllocationSelect
          // TODO
          items={allocations.data!}
          value={allocation()}
          class={css.allocations}
          onChange={setAllocation}
        />
        // <Tag type="primary">
        //   North Valley Enterprises | <strong>$100.00</strong>
        // </Tag>
      }
      actions={
        <div class={css.actions}>
          <Button id="add-balance-button" type="primary" size="lg" icon="add">
            Add balance
          </Button>
          <Dropdown
            id="add-new-dropdown"
            position="bottom-right"
            menu={
              <>
                <MenuItem name="employee" onClick={() => navigate('/employees/edit')}>
                  Employee
                </MenuItem>
                <MenuItem name="allocation" onClick={() => navigate('/allocations/edit')}>
                  Allocation
                </MenuItem>
                <MenuItem name="card" onClick={() => navigate('/cards/edit')}>
                  Card
                </MenuItem>
              </>
            }
          >
            <Button id="add-new-button" size="lg" icon={{ name: 'chevron-down', pos: 'right' }}>
              Add new
            </Button>
          </Dropdown>
        </div>
      }
    >
      <Overview />
      {/*<Landing />*/}
    </Page>
  );
}
