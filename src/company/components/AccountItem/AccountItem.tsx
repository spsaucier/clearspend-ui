import type { JSXElement } from 'solid-js';

import { Icon, IconName } from '_common/components/Icon';

import css from './AccountItem.css';

interface AccountItemProps {
  icon: keyof typeof IconName;
  title: JSXElement;
  text: JSXElement;
  onClick: () => void;
}

export function AccountItem(props: Readonly<AccountItemProps>) {
  return (
    <div class={css.root} onClick={props.onClick}>
      <div class={css.icon}>
        <Icon name={props.icon} />
      </div>
      <div>
        <div class={css.name}>{props.title}</div>
        <div class={css.number}>{props.text}</div>
      </div>
      <Icon name="chevron-right" />
    </div>
  );
}
