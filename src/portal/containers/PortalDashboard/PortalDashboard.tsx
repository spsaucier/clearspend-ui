import type { JSXElement } from 'solid-js';

import { PortalHeader } from '../PortalHeader';

import css from './PortalDashboard.css';

interface PortalDashboardProps {
  children: JSXElement;
}

export function PortalDashboard(props: Readonly<PortalDashboardProps>) {
  return (
    <div class={css.wrapper}>
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
      <div class={css.backgroundMask}></div>
      <div class={css.content}>{props.children}</div>
    </div>
  );
}
