import { Tag, TagProps } from './Tag';

export default {
  title: 'Common/Tag',
  component: Tag,
  argTypes: {
    size: {
      options: ['md', 'sm', 'xs'],
      control: { type: 'radio' },
    },
    label: { control: { type: 'text' } },
    children: { control: { type: 'text' } },
  },
  args: {
    size: 'md',
    label: 'Label',
    children: 'Text...',
  },
};

export const Default = (args: TagProps) => <Tag {...args} />;
