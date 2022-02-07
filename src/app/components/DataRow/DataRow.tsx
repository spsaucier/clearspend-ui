import type { JSXElement } from 'solid-js';

import { join } from '_common/utils/join';
import { Icon, IconName } from '_common/components/Icon';

import css from './DataRow.css';

interface DataRowProps {
  icon: keyof typeof IconName;
  class?: string;
  contentClass?: string;
  children: JSXElement;
}

export function DataRow(props: Readonly<DataRowProps>) {
  return (
    <div class={join(css.root, props.class)}>
      <Icon size="sm" name={props.icon} />
      <span class={props.contentClass}>{props.children}</span>
    </div>
  );
}
