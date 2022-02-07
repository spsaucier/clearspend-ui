import { createMemo, Index, Accessor } from 'solid-js';
import { defineMessages } from 'solid-i18n';

import { join } from '_common/utils/join';

import { MenuItem, MenuItemOptions } from './MenuItem';

import css from './MainMenu.css';

const TITLES = defineMessages({
  dashboard: { message: 'Dashboard' },
  allocations: { message: 'Allocations' },
  card: { message: 'Card' },
  employees: { message: 'Employees' },
  company: { message: 'Company Settings' },
  profile: { message: 'Account Settings' },
});

const MAIN_ITEMS: readonly Readonly<MenuItemOptions>[] = [
  { href: '/', title: TITLES.dashboard, icon: 'dashboard', end: true },
  { href: '/allocations', title: TITLES.allocations, icon: 'allocations' },
  { href: '/cards', title: TITLES.card, icon: 'card' },
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
  const expanded = createMemo(() => [MenuView.expanded, MenuView.mobile].includes(props.view as MenuView));
  const itemClass = createMemo(() => (props.view === MenuView.mobile ? css.mobileItem : undefined));

  const renderItem = (item: Accessor<MenuItemOptions>) => (
    <MenuItem {...item()} expanded={expanded()} class={itemClass()} onClick={props.onItemClick} />
  );

  return (
    <nav class={join(css.root, props.class)}>
      <div classList={{ [css.mainGrow!]: props.view !== MenuView.mobile }}>
        <Index each={MAIN_ITEMS}>{renderItem}</Index>
      </div>
      <div>
        <Index each={SECOND_ITEMS}>{renderItem}</Index>
      </div>
    </nav>
  );
}
