import { createMemo, Index, Accessor } from 'solid-js';
import { defineMessages } from 'solid-i18n';

import { join } from '_common/utils/join';
import { useBusiness } from 'app/containers/Main/context';
import { canManageCards, canManageConnections } from 'allocations/utils/permissions';

import { MenuItem, MenuItemOptions } from './MenuItem';

import css from './MainMenu.css';

const TITLES = defineMessages({
  dashboard: { message: 'Dashboard' },
  allocations: { message: 'Allocations' },
  card: { message: 'Cards' },
  employees: { message: 'Employees' },
  company: { message: 'Company Settings' },
  profile: { message: 'Account Settings' },
  accounting: { message: 'Accounting' },
});

const MAIN_ITEMS: readonly Readonly<MenuItemOptions>[] = [
  { href: '/', title: TITLES.dashboard, icon: 'dashboard', end: true },
  { href: '/allocations', title: TITLES.allocations, icon: 'allocations' },
  { href: '/cards', title: TITLES.card, icon: 'card' },
  { href: '/accounting', title: TITLES.accounting, icon: 'accounting' },
  { href: '/employees', title: TITLES.employees, icon: 'employees' },
  { href: '/settings', title: TITLES.company, icon: 'company' },
];

const SECOND_ITEMS: readonly Readonly<MenuItemOptions>[] = [{ href: '/profile', title: TITLES.profile, icon: 'user' }];

export enum MenuView {
  collapsed = 'collapsed',
  expanded = 'expanded',
  mobile = 'mobile',
}

interface MainMenuProps {
  view: keyof typeof MenuView;
  class?: string;
  onItemClick?: () => void;
}

export function MainMenu(props: Readonly<MainMenuProps>) {
  const { permissions } = useBusiness();
  const expanded = createMemo(() => [MenuView.expanded, MenuView.mobile].includes(props.view as MenuView));
  const isNotProd = window.location.host !== 'app.clearspend.com';
  const mainItems = createMemo(() => {
    return MAIN_ITEMS.filter((item) => {
      switch (item.title) {
        case TITLES.employees:
          return canManageCards(permissions()); // TODO: change to canViewEmployees based on Manage+ permissions at any allocation
        case TITLES.accounting:
          return canManageConnections(permissions()) && isNotProd;
        case TITLES.company:
          return canManageConnections(permissions());
        default:
          return true;
      }
    });
  });

  const renderItem = (item: Accessor<MenuItemOptions>) => (
    <MenuItem {...item()} expanded={expanded()} onClick={props.onItemClick} />
  );

  return (
    <nav class={join(css.root, props.class)}>
      <div
        classList={{
          [css.mainMobile!]: props.view === MenuView.mobile,
          [css.mainGrow!]: props.view !== MenuView.mobile,
        }}
      >
        <Index each={mainItems()}>{renderItem}</Index>
      </div>
      <div>
        <Index each={SECOND_ITEMS}>{renderItem}</Index>
      </div>
    </nav>
  );
}
