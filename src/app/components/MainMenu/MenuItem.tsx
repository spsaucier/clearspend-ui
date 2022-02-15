import { useI18n, Text } from 'solid-i18n';
import type { I18nMessage } from 'i18n-mini/lib/types';
import { NavLink } from 'solid-app-router';

import { Icon, IconName } from '_common/components/Icon';
import { Tooltip } from '_common/components/Tooltip';
import { join } from '_common/utils/join';

import css from './MenuItem.css';

export interface MenuItemOption {
  href: string;
  title: I18nMessage;
  icon: keyof typeof IconName;
  end?: boolean;
}

interface MenuItemProps extends MenuItemOption {
  class?: string;
  expanded: boolean;
  onClick?: () => void;
}

export function MenuItem(props: Readonly<MenuItemProps>) {
  const i18n = useI18n();

  return (
    <Tooltip enterDelay={0} position="middle-right" message={i18n.t(props.title)} disabled={props.expanded}>
      {(args) => (
        <NavLink
          {...args}
          end={props.end}
          href={props.href}
          data-expanded={props.expanded}
          class={join(css.root, props.class)}
          activeClass={css.active}
          onClick={props.onClick}
        >
          <Icon name={props.icon} class={css.icon} />
          <Text {...props.title} class={css.title!} />
        </NavLink>
      )}
    </Tooltip>
  );
}
