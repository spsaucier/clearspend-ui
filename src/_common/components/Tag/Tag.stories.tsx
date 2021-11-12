import { Tag, TagProps } from './Tag';

export default {
  title: 'Common/Tag',
  component: Tag,
  argTypes: {
    type: {
      options: ['default', 'success', 'danger'],
      control: { type: 'radio' },
    },
    size: {
      options: ['md', 'sm', 'xs'],
      control: { type: 'radio' },
    },
    label: { control: { type: 'text' } },
    children: { control: { type: 'text' } },
  },
  args: {
    type: 'default',
    size: 'md',
    label: 'Label',
    children: 'Text...',
  },
};

export const Default = (args: TagProps) => <Tag {...args} />;
