import { Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { Button } from '_common/components/Button';
import { Dropdown, MenuItem } from '_common/components/Dropdown';
import { Tag } from '_common/components/Tag';
import { ownerStore } from 'app/stores/owner';

import { Page } from '../../components/Page';
// import { Landing } from '../../containers/Landing';
import { Overview } from '../../containers/Overview';

import css from './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <Page
      title={<Text message="Welcome, {name}" name={ownerStore.data.firstName} />}
      contentClass={css.content}
      extra={
        <Tag type="primary">
          North Valley Enterprises | <strong>$100.00</strong>
        </Tag>
      }
      actions={
        <div class={css.actions}>
          <Button type="primary" size="lg" icon="add">
            Add balance
          </Button>
          <Dropdown
            position="bottom-right"
            menu={
              <>
                <MenuItem onClick={() => navigate('/employees/edit')}>Employee</MenuItem>
                <MenuItem onClick={() => navigate('/allocations/edit')}>Allocation</MenuItem>
                <MenuItem onClick={() => navigate('/cards/edit')}>Card</MenuItem>
              </>
            }
          >
            <Button size="lg" icon={{ name: 'chevron-down', pos: 'right' }}>
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
