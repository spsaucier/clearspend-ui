import { Show, type JSXElement } from 'solid-js';

import { Icon, IconName } from '_common/components/Icon';

import css from './Account.css';

interface AccountProps {
  icon: keyof typeof IconName;
  name: JSXElement;
  extra?: JSXElement;
  inline?: boolean;
}

export function Account(props: Readonly<AccountProps>) {
  return (
    <div class={css.root}>
      <div class={css.iconWrap}>
        <Icon name={props.icon} class={css.icon} />
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
