import { PortalHeader } from './PortalHeader';

export default {
  title: 'Portal/Header',
  component: PortalHeader,
};

export const Default = () => {
  return (
    <PortalHeader
      branding={'West Side Accounting'}
      navigationItems={[
        {
          label: 'Accounts',
          href: 'https://google.com',
        },
        {
          label: 'My Team',
          onClick: () => {
            //
          },
        },
        {
          label: 'Settings',
          href: '',
        },
        {
          label: 'Help and Support',
          href: '',
        },
      ]}
      selectedLabel={'Accounts'}
    />
  );
};
