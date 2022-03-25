import { Review, ReviewDetails } from './Review';

export default {
  title: 'Onboarding/Review',
  component: Review,
  argTypes: {
    type: {
      ownerEmail: { type: 'string' },
    },
  },
  args: {
    ownerEmail: 'mr.ceo@google.com',
    refetch: () => Promise.resolve(),
  },
};

export const Default = (args: ReviewDetails) => <Review {...args} />;
