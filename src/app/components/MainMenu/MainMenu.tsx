import { NavLink } from 'solid-app-router';

import { join } from '_common/utils/join';
import { Icon } from '_common/components/Icon';

import css from './MainMenu.css';

interface MainMenuProps {
  class?: string;
  onItemClick?: () => void;
}

export function MainMenu(props: Readonly<MainMenuProps>) {
  return (
    <nav class={join(css.root, props.class)}>
      <NavLink end href="/" class={css.item} activeClass={css.active} onClick={props.onItemClick}>
        <Icon name="dashboard" />
        <span class={css.title}>Dashboard</span>
      </NavLink>
      <NavLink href="/allocations" class={css.item} activeClass={css.active} onClick={props.onItemClick}>
        <Icon name="allocations" />
        <span class={css.title}>Allocations</span>
      </NavLink>
    </nav>
  );
}
