import { JSXElement, Show } from 'solid-js';

import { join } from '../../utils/join';
import { Icon, IconName } from '../Icon';
import { Button } from '../Button';

import css from './Message.css';

type MessageType = 'error' | 'success'; // 'info' | 'warn';

const ICONS: Readonly<Record<MessageType, IconName>> = {
  error: IconName['warning-rounded'],
  success: IconName['confirm-circle'],
};

export interface MessageProps {
  type: MessageType;
  title: JSXElement;
  message?: JSXElement;
  class?: string;
  onClose: () => void;
}

export function Message(props: Readonly<MessageProps>) {
  return (
    <div class={join(css.root, props.class)}>
      <Icon
        name={ICONS[props.type]}
        class={join(css.icon, props.type === 'error' && css.error, props.type === 'success' && css.success)}
      />
      <div class={css.content}>
        <h3 class={css.title}>{props.title}</h3>
        <Show when={props.message}>
          <div class={css.message}>{props.message}</div>
        </Show>
      </div>
      <Button icon="cancel" size="sm" ghost class={css.close} onClick={props.onClose} />
    </div>
  );
}
