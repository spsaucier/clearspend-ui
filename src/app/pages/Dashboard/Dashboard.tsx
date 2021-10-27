import { Text } from 'solid-i18n';
import { useNavigate } from 'solid-app-router';

import { Button } from '_common/components/Button';
import { Dropdown, MenuItem } from '_common/components/Dropdown';
import { Tag } from '_common/components/Tag';
import { readSignupName } from 'signup/storage';

import { Page } from '../../components/Page';
import { Landing } from '../../containers/Landing';

import css from './Dashboard.css';

export default function Dashboard() {
  const name = readSignupName();
  const navigate = useNavigate();

  return (
    <Page
      title={<Text message="Welcome, {name}" name={name?.firstName || ''} />}
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
                <MenuItem onClick={() => navigate('/cards/edit')}>Card</MenuItem>
                <MenuItem onClick={() => navigate('/employees/edit')}>Employee</MenuItem>
                <MenuItem onClick={() => navigate('/allocations/edit')}>Allocation</MenuItem>
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
      <Landing />
    </Page>
  );
}
