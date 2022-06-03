import { Text } from 'solid-i18n';

import { MoreVerticalDropdown } from 'partner/components/MoreVerticalDropdown/MoreVerticalDropdown';
import { MenuItem } from '_common/components/Dropdown';
import { Table, TableColumn } from '_common/components/Table';

import { PartnerDashboard } from './PartnerDashboard';
import { PartnerEmptyDashboardContent } from './PartnerEmptyDashboardContent';

export default {
  title: 'Partner/Dashboard',
  component: PartnerDashboard,
};

export const DashboardEmpty = () => {
  return (
    <PartnerDashboard partnerName="West Side Accounting">
      <PartnerEmptyDashboardContent />
    </PartnerDashboard>
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
    <PartnerDashboard partnerName="West Side Accounting">
      <Table columns={COLUMNS} data={DATA} darkMode={true} />
    </PartnerDashboard>
  );
};
