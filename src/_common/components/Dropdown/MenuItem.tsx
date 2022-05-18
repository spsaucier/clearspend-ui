import { JSXElement, useContext } from 'solid-js';

import { KEY_CODES } from '../../constants/keyboard';

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

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case KEY_CODES.ArrowDown:
        (document.activeElement?.nextElementSibling as HTMLElement | null)?.focus();
        event.preventDefault();
        break;
      case KEY_CODES.ArrowUp: {
        const prev = document.activeElement?.previousElementSibling as HTMLElement | null;
        prev ? prev.focus() : context.onItemClick?.();
        event.preventDefault();
        break;
      }
      case KEY_CODES.Enter:
      case KEY_CODES.Space:
        onClick();
        break;
      case KEY_CODES.Escape:
        context.onItemClick?.();
        break;
      default:
    }
  };

  return (
    <li
      tabIndex="0"
      data-name={props.name}
      class={css.root}
      classList={{
        [props.class!]: !!props.class,
        [css.disabled!]: props.disabled,
      }}
      onClick={onClick}
      onKeyDown={onKeyDown}
    >
      {props.children}
    </li>
  );
}
