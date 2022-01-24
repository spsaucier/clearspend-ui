import { createSignal, Switch, Match } from 'solid-js';
import { Text } from 'solid-i18n';

import { useNav } from '_common/api/router';
import { Button } from '_common/components/Button';
import { Dropdown, MenuItem } from '_common/components/Dropdown';
// import { Tag } from '_common/components/Tag';
import { Drawer } from '_common/components/Drawer';
import { Loading } from 'app/components/Loading';
import { LoadingError } from 'app/components/LoadingError';
import { AllocationSelect } from 'allocations/components/AllocationSelect';
import { ManageBalance } from 'allocations/containers/ManageBalance';
import { useAllocations } from 'allocations/stores/allocations';
import { getRootAllocation } from 'allocations/utils/getRootAllocation';

import { Page } from '../../components/Page';
// import { Landing } from '../../containers/Landing';
import { Overview } from '../../containers/Overview';
import { useBusiness } from '../../containers/Main/context';

import css from './Dashboard.css';

export default function Dashboard() {
  const navigate = useNav();
  const { owner } = useBusiness();

  const [allocation, setAllocation] = createSignal<string>();
  const [manageId, setManageId] = createSignal<string>();

  const allocations = useAllocations({
    initValue: [],
    onSuccess: (data) => {
      const root = getRootAllocation(data);
      if (root) setAllocation(root.allocationId);
    },
  });

  return (
    <Page
      title={<Text message="Welcome, {name}" name={owner().firstName || ''} />}
      contentClass={css.content}
      extra={
        <AllocationSelect
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
          <Button
            id="add-balance-button"
            type="primary"
            size="lg"
            icon="dollars"
            onClick={() => setManageId(allocation())}
          >
            <Text message="Manage Balance" />
          </Button>
          <Dropdown
            id="add-new-dropdown"
            position="bottom-right"
            menu={
              <>
                <MenuItem name="employee" onClick={() => navigate('/employees/edit')}>
                  <Text message="Employee" />
                </MenuItem>
                <MenuItem name="allocation" onClick={() => navigate('/allocations/edit')}>
                  <Text message="Allocation" />
                </MenuItem>
                <MenuItem name="card" onClick={() => navigate('/cards/edit')}>
                  <Text message="Card" />
                </MenuItem>
              </>
            }
          >
            <Button id="add-new-button" size="lg" icon={{ name: 'chevron-down', pos: 'right' }}>
              <Text message="Add new" />
            </Button>
          </Dropdown>
        </div>
      }
    >
      <Switch>
        <Match when={allocations.error}>
          <LoadingError onReload={allocations.reload} />
        </Match>
        <Match when={allocations.loading && !allocations.data?.length}>
          <Loading />
        </Match>
        <Match when={allocations.data}>
          <Overview allocationId={allocation()} />
          {/*<Landing />*/}
        </Match>
      </Switch>
      <Drawer open={Boolean(manageId())} title={<Text message="Manage balance" />} onClose={() => setManageId()}>
        <ManageBalance allocationId={manageId()!} onReload={allocations.reload} onClose={() => setManageId()} />
      </Drawer>
    </Page>
  );
}
