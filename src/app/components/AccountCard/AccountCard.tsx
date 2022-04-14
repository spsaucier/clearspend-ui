import { createMemo, Show, type JSXElement } from 'solid-js';

import { Icon, IconName } from '_common/components/Icon';

import css from './AccountCard.css';

interface AccountCardProps {
  icon: keyof typeof IconName;
  title: JSXElement;
  text?: JSXElement;
  onClick?: () => void;
}

export function AccountCard(props: Readonly<AccountCardProps>) {
  const interactive = createMemo(() => typeof props.onClick === 'function');

  return (
    <div class={css.root} classList={{ [css.interactive!]: interactive() }} onClick={props.onClick}>
      <div class={css.icon}>
        <Icon name={props.icon} />
      </div>
      <div>
        <div class={css.name}>{props.title}</div>
        <Show when={props.text}>
          <div class={css.number}>{props.text}</div>
        </Show>
      </div>
      <Show when={interactive()}>
        <Icon name="chevron-right" />
      </Show>
    </div>
  );
}
