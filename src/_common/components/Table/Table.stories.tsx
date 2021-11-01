import { Table, TableColumn } from './Table';

interface Mock {
  key: string;
  name: string;
  age: number;
  address: string;
}

const COLUMNS: readonly TableColumn<Mock>[] = [
  { title: 'Name', name: 'name' },
  { title: 'Age', name: 'age' },
  { title: 'Address', name: 'address' },
];

const DATA: readonly Mock[] = [
  { key: '1', name: 'Mike', age: 32, address: '10 Downing Street' },
  { key: '2', name: 'John', age: 42, address: '10 Downing Street' },
];

export default {
  title: 'Common/Table',
  component: Table,
  argTypes: {},
  args: {},
};

export const Default = () => <Table columns={COLUMNS} data={DATA} />;
