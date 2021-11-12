import { Pagination, PaginationProps } from './Pagination';

export default {
  title: 'Common/Pagination',
  component: Pagination,
  argTypes: {
    current: {
      control: { type: 'number', min: 0, max: 9 },
    },
    pageSize: { table: { disable: true } },
    total: { table: { disable: true } },
    onChange: { action: 'change', table: { disable: true } },
  },
  args: {
    current: 0,
    pageSize: 10,
    total: 100,
  },
};

export const Default = (args: PaginationProps) => <Pagination {...args} />;
