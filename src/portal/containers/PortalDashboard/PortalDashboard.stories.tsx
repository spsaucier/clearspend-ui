import { Text } from 'solid-i18n';

import { MoreVerticalDropdown } from 'portal/components/MoreVerticalDropdown/MoreVerticalDropdown';
import { MenuItem } from '_common/components/Dropdown';
import { Table, TableColumn } from '_common/components/Table';

import { PortalDashboard } from './PortalDashboard';
import { PortalEmptyDashboardContent } from './PortalEmptyDashboardContent';

export default {
  title: 'Portal/Dashboard',
  component: PortalDashboard,
};

export const DashboardEmpty = () => {
  return (
    <PortalDashboard>
      <PortalEmptyDashboardContent />
    </PortalDashboard>
  );
};

interface Mock {
  key: string;
  name: string;
  age: number;
  address: string;
}

const COLUMNS: readonly TableColumn<Mock>[] = [
  { title: 'Name', name: 'name' },
  { title: 'Age', name: 'age' },
  {
    title: 'Options',
    name: 'options',
    render: () => {
      return (
        <MoreVerticalDropdown lightMode={true}>
          <MenuItem>
            <Text message="Delete account" />
          </MenuItem>
        </MoreVerticalDropdown>
      );
    },
  },
];

const DATA: readonly Mock[] = [
  { key: '1', name: 'Mike', age: 32, address: '10 Downing Street' },
  { key: '2', name: 'John', age: 42, address: '10 Downing Street' },
];

export const DashboardWithTable = () => {
  return (
    <PortalDashboard>
      <Table columns={COLUMNS} data={DATA} darkMode={true} />
    </PortalDashboard>
  );
};
