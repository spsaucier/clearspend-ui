import { Button } from '../Button';

import { Confirm, ConfirmProps, FuncProps } from './Confirm';

export default {
  title: 'Common/Confirm',
  component: Confirm,
  argTypes: {
    children: { table: { disable: true } },
    onConfirm: { action: 'confirm', table: { disable: true } },
  },
  args: {
    question: 'Are you sure you want to delete?',
    confirmText: 'Delete',
    children: (props: FuncProps) => (
      <Button type="danger" {...props}>
        Delete
      </Button>
    ),
  },
};

export const Default = (args: ConfirmProps) => <Confirm {...args} />;
