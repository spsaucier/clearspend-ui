import type { JSXElement } from 'solid-js';

import { PartnerHeader } from '../PartnerHeader';

import css from './PartnerDashboard.css';

interface PartnerDashboardProps {
  partnerName: string;
  children: JSXElement;
}

export function PartnerDashboard(props: Readonly<PartnerDashboardProps>) {
  return (
    <div class={css.wrapper}>
      <PartnerHeader
        branding={props.partnerName}
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
      <div class={css.content}>{props.children}</div>
    </div>
  );
}
