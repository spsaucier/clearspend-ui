import { Index } from 'solid-js';
import { defineMessages, useI18n, Text } from 'solid-i18n';
import type { I18nMessage } from 'i18n-mini/lib/types';
import { NavLink } from 'solid-app-router';

import { join } from '_common/utils/join';
import { Icon, IconName } from '_common/components/Icon';
import { Tooltip } from '_common/components/Tooltip';

import css from './MainMenu.css';

const TITLES = defineMessages({
  dashboard: { message: 'Dashboard' },
  allocations: { message: 'Allocations' },
  card: { message: 'Card' },
  employees: { message: 'Employees' },
});

interface MenuItem {
  href: string;
  title: I18nMessage;
  icon: keyof typeof IconName;
  end?: boolean;
}

const ITEMS: readonly Readonly<MenuItem>[] = [
  { href: '/', title: TITLES.dashboard, icon: 'dashboard', end: true },
  { href: '/allocations', title: TITLES.allocations, icon: 'allocations' },
  { href: '/cards', title: TITLES.card, icon: 'card' },
  { href: '/employees', title: TITLES.employees, icon: 'user' },
];

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
  const i18n = useI18n();

  return (
    <nav
      class={join(css.root, props.class)}
      classList={{
        [css.expanded!]: [MenuView.expanded, MenuView.mobile].includes(props.view as MenuView),
        [css.mobile!]: props.view === MenuView.mobile,
      }}
    >
      <Index each={ITEMS}>
        {(item) => (
          <Tooltip
            position="middle-right"
            message={i18n.t(item().title)}
            enterDelay={0}
            leaveDelay={0}
            disabled={props.view === 'expanded'}
          >
            {(args) => (
              <NavLink
                {...args}
                end={item().end}
                href={item().href}
                class={css.item}
                activeClass={css.active}
                onClick={props.onItemClick}
              >
                <Icon name={item().icon} class={css.icon} />
                <Text {...item().title} class={css.title!} />
              </NavLink>
            )}
          </Tooltip>
        )}
      </Index>
    </nav>
  );
}
