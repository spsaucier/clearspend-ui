import { Show, type JSXElement } from 'solid-js';

import { Icon, IconName } from '_common/components/Icon';

import css from './Account.css';

type IconType = keyof typeof IconName;

interface AccountProps {
  icon: IconType | JSXElement;
  noWrapIcon?: boolean;
  name: JSXElement;
  extra?: JSXElement;
  inline?: boolean;
}

export function Account(props: Readonly<AccountProps>) {
  return (
    <div class={css.root}>
      <div classList={{ [css.iconWrap!]: !props.noWrapIcon }}>
        <Show when={typeof props.icon === 'string'} fallback={props.icon}>
          <Icon name={props.icon as IconType} class={css.icon} />
        </Show>
      </div>
      <div class={css.content} classList={{ [css.inline!]: props.inline }}>
        <div>{props.name}</div>
        <Show when={props.extra}>
          <div class={css.extra}>{props.extra}</div>
        </Show>
      </div>
    </div>
  );
}
