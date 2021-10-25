import { JSXElement, useContext } from 'solid-js';

import { DropdownContext } from './context';

import css from './MenuItem.css';

interface MenuItemProps {
  disabled?: boolean;
  children: JSXElement;
  onClick?: () => void;
}

export function MenuItem(props: Readonly<MenuItemProps>) {
  const context = useContext(DropdownContext);

  const onClick = () => {
    props.onClick?.();
    context.onItemClick?.();
  };

  return (
    <li class={css.root} classList={{ [css.disabled!]: props.disabled }} onClick={onClick}>
      {props.children}
    </li>
  );
}
