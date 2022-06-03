import { PartnerHeader } from './PartnerHeader';

export default {
  title: 'Partner/Header',
  component: PartnerHeader,
};

export const Default = () => {
  return (
    <PartnerHeader
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
