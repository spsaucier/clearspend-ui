import { Text } from 'solid-i18n';

import { Button } from '_common/components/Button';
import { Dropdown, MenuItem } from '_common/components/Dropdown';
import { Tag } from '_common/components/Tag';
import { readSignupName } from 'signup/storage';

import { Page } from '../../components/Page';
import { Landing } from '../../containers/Landing';

import css from './Dashboard.css';

export function Dashboard() {
  const name = readSignupName();

  return (
    <Page
      title={<Text message="Welcome, {name}" name={name?.firstName || ''} />}
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
                <MenuItem>Card</MenuItem>
                <MenuItem>Employee</MenuItem>
                <MenuItem>Allocation</MenuItem>
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
