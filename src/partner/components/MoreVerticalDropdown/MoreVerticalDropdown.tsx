import type { JSXElement } from 'solid-js';

import { Button } from '_common/components/Button';
import { Dropdown } from '_common/components/Dropdown';
import { join } from '_common/utils/join';

import css from './MoreVerticalDropdown.css';

export interface MoreVerticalDropdownProps {
  children: JSXElement | JSXElement[];
  lightMode?: boolean;
}

export function MoreVerticalDropdown(props: Readonly<MoreVerticalDropdownProps>) {
  return (
    <Dropdown position="bottom-right" menu={<>{props.children}</>}>
      <Button view="ghost" icon="more-vertical" class={join(css.more, props.lightMode && css.light)} />
    </Dropdown>
  );
}
