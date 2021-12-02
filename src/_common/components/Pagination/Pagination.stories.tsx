import { Pagination, PaginationProps } from './Pagination';

export default {
  title: 'Common/Pagination',
  component: Pagination,
  argTypes: {
    current: {
      control: { type: 'number', min: 0, max: 9 },
    },
    pageSize: { type: 'number', min: 1, max: 100 },
    total: { type: 'number', min: 0, max: 1000 },
    onChange: { action: 'change', table: { disable: true } },
  },
  args: {
    current: 0,
    pageSize: 10,
    total: 100,
  },
};

export const Default = (args: PaginationProps) => <Pagination {...args} />;
