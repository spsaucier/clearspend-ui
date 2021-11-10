import { JSXElement, useContext } from 'solid-js';

import { join } from '../../utils/join';

import { DropdownContext } from './context';

import css from './MenuItem.css';

interface MenuItemProps {
  name?: string;
  disabled?: boolean;
  class?: string;
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
    <li
      data-name={props.name}
      class={join(css.root, props.class)}
      classList={{ [css.disabled!]: props.disabled }}
      onClick={onClick}
    >
      {props.children}
    </li>
  );
}
