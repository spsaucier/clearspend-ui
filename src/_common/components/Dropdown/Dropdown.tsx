import type { JSXElement } from 'solid-js';

import { Popover, PopoverPosition } from '../Popover';
import { useBool } from '../../utils/useBool';
import { join } from '../../utils/join';
import { KEY_CODES } from '../../constants/keyboard';

import { DropdownContext } from './context';

import css from './Dropdown.css';

export interface DropdownProps {
  id?: string;
  menu: JSXElement;
  position?: PopoverPosition;
  popupClass?: string;
  class?: string;
  children: JSXElement;
}

export function Dropdown(props: Readonly<DropdownProps>) {
  let root!: HTMLDivElement;
  let list!: HTMLUListElement;

  const [open, toggle] = useBool();

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.keyCode === KEY_CODES.ArrowDown) {
      if (!open()) toggle();
      (list.firstElementChild as HTMLElement | null)?.focus();
      event.preventDefault();
    }
  };

  const onItemClick = () => {
    toggle();
    (root.firstElementChild as HTMLElement | null)?.focus();
  };

  return (
    <Popover
      id={props.id}
      open={open()}
      position={props.position}
      class={join(css.popup, props.popupClass)}
      onClickOutside={toggle}
      content={
        <ul ref={list} class={css.menu}>
          <DropdownContext.Provider value={{ onItemClick }}>{props.menu}</DropdownContext.Provider>
        </ul>
      }
    >
      <div ref={root} class={join(css.root, props.class)} onClick={() => toggle()} onKeyDown={onKeyDown}>
        {props.children}
      </div>
    </Popover>
  );
}
