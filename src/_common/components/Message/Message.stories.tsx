import { Message, MessageProps } from './Message';

export default {
  title: 'Common/Message',
  component: Message,
  argTypes: {
    type: {
      options: ['error', 'success'],
      control: { type: 'radio' },
    },
    title: { control: { type: 'text' } },
    message: { control: { type: 'text' } },
    onClose: { action: 'close', table: { disable: true } },
  },
  args: {
    type: 'error',
    title: 'Title',
    message: 'Message text...',
  },
};

export const Default = (args: MessageProps) => <Message {...args} />;
