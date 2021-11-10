import type { JSXElement } from 'solid-js';

import { Popover, PopoverPosition } from '../Popover';
import { useBool } from '../../utils/useBool';
import { join } from '../../utils/join';

import { DropdownContext } from './context';

import css from './Dropdown.css';

export interface DropdownProps {
  id?: string;
  menu: JSXElement;
  position?: PopoverPosition;
  class?: string;
  children: JSXElement;
}

export function Dropdown(props: Readonly<DropdownProps>) {
  const [open, toggle] = useBool();

  return (
    <Popover
      id={props.id}
      open={open()}
      position={props.position}
      class={css.popup}
      onClickOutside={toggle}
      content={
        <ul class={css.menu}>
          <DropdownContext.Provider value={{ onItemClick: toggle }}>{props.menu}</DropdownContext.Provider>
        </ul>
      }
    >
      <div class={join(css.root, props.class)} onClick={() => toggle()}>
        {props.children}
      </div>
    </Popover>
  );
}
