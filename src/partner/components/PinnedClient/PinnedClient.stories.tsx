import { PinnedClient, type PinnedClientProps } from './PinnedClient';

export default {
  title: 'Portal/PinnedClient',
  component: PinnedClient,
  argTypes: {
    onInviteClick: { action: 'invite', table: { disable: true } },
    onSettingsClick: { action: 'settings', table: { disable: true } },
    onUnpinClick: { action: 'unpin', table: { disable: true } },
    onDeleteClick: { action: 'delete', table: { disable: true } },
  },
};

export const Default = (args: PinnedClientProps) => (
  <div style={{ display: 'grid', 'grid-gap': '10px' }}>
    <PinnedClient {...args} type="my" name="West Side Accounting" amount={{ currency: 'USD', amount: 54579.04 }} />
    <PinnedClient {...args} type="client" name="Craig’s Automotive" amount={{ currency: 'USD', amount: 999.99 }} />
    <PinnedClient {...args} type="invite" name="Client Name" />
  </div>
);
